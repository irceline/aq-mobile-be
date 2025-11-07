import { Component, Input, OnInit } from '@angular/core';
import { CalendarDateFormatter, CalendarView } from 'angular-calendar';
import * as moment from 'moment';
import { CustomDateFormatter } from './custom-date-formatter.provider';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-feedback-calendar',
  templateUrl: './feedback-calendar.component.html',
  styleUrls: [
    './feedback-calendar.component.scss',
    './feedback-calendar.component.hc.scss',
  ],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class FeedbackCalendarComponent implements OnInit {
  @Input() lang: string = 'en'; // example: 'en', 'fr', 'id', 'nl', etc.

  selectedDate: string = new Date().toISOString();
  currentMonth: Date = new Date();
  currentMonthName: string = '';
  currentYear: number = 0;

  minDate = '2000-01-01';
  maxDate = '2100-12-31';
  view: CalendarView = CalendarView.Month;
  formattedDate: string = '';
  showCalendar: boolean = false;
  CalendarView = CalendarView;
  timeError: boolean = false;
  viewDate: Date = new Date();
  timeOptions = [
    { start: '00:00', end: '02:00' },
    { start: '02:00', end: '04:00' },
    { start: '04:00', end: '06:00' },
    { start: '06:00', end: '08:00' },
    { start: '08:00', end: '10:00' },
    { start: '10:00', end: '12:00' },
    { start: '12:00', end: '14:00' },
    { start: '14:00', end: '16:00' },
    { start: '16:00', end: '18:00' },
    { start: '18:00', end: '20:00' },
    { start: '20:00', end: '22:00' },
    { start: '22:00', end: '00:00' },
  ];
  selectedTime = { start: '', end: '' };

  constructor(
    private translate: TranslateService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.updateMonthDisplay();
    this.getCurrentTime();
  }

  updateMonthDisplay() {
    this.currentMonthName = this.currentMonth.toLocaleString(this.lang, {
      month: 'long',
    });
    this.currentYear = this.currentMonth.getFullYear();
  }

  goToPreviousMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.updateMonthDisplay();
    this.selectedDate = this.currentMonth.toISOString();
  }

  goToNextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.updateMonthDisplay();
    this.selectedDate = this.currentMonth.toISOString();
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
  }

  getDate(date: Date) {
    const activeDay = moment(this.viewDate).format('DDMMM');
    const day = moment(date).format('DDMMM');
    if (activeDay === day) return true;
    return false;
  }

  changeDay(event: any) {
    const date = event.detail || event; // support both cases
    this.viewDate = date;
    this.formattedDate = moment(date).format('DD.MM.YYYY');
    this.showCalendar = false;
  }

  getLocale() {
    return this.translate.currentLang ? this.translate.currentLang : 'en';
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    for (let i = 0; i < this.timeOptions.length; i++) {
      const startHour = parseInt(this.timeOptions[i].start.split(':')[0]);
      const endHour = parseInt(this.timeOptions[i].end.split(':')[0]);
      if (hours >= startHour || (startHour === 22 && hours < 2)) {
        if (hours >= startHour && hours < endHour) {
          return this.selectedTime = this.timeOptions[i];
        }
        if (startHour === 22 && (hours >= 22 || hours < 2)) {
          return this.selectedTime = this.timeOptions[i];
        }
      }
    }

    return this.selectedTime = this.timeOptions[0];
  }

  selectTime(time) {
    this.selectedTime = time;
  }
}
