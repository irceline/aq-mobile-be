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
  @Input() lang: string = 'en';
  @Input() color: string = '';
  @Input() minDate!: string;
  @Input() maxDate!: string;
  @Input() initialDate?: Date;
  @Input() initialStartDate?: Date;
  @Input() initialEndDate?: Date;

  selectedDate: string = new Date().toISOString();
  currentMonth: Date = new Date();
  currentMonthName: string = '';
  currentYear: number = 0;
  view: CalendarView = CalendarView.Month;
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
  isNow: boolean = false;

  constructor(
    private translate: TranslateService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    if (this.initialStartDate?.getHours() !== this.initialEndDate?.getHours()) {
      this.setInitialSelectedTime();
    } else {
      this.getSelectedTime();
    }

    if (this.initialDate) {
      this.viewDate = this.initialDate;
      this.selectedDate = this.initialDate.toISOString();
    }
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
    const date = event.detail || event;
    const selected = moment(date).startOf('day');
    const today = moment().startOf('day');
    const min = moment().subtract(6, 'days').startOf('day');

    if (selected.isAfter(today) || selected.isBefore(min)) {
      return;
    }

    this.viewDate = date;
    this.showCalendar = false;
    this.isNow = false;
  }

  getLocale() {
    return this.translate.currentLang ? this.translate.currentLang : 'en';
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  getSelectedTime() {
    this.isNow = true;
    const now = new Date();
    const hours = now.getHours();
    for (let i = 0; i < this.timeOptions.length; i++) {
      const startHour = parseInt(this.timeOptions[i].start.split(':')[0]);
      const endHour = parseInt(this.timeOptions[i].end.split(':')[0]);
      if (hours >= startHour || (startHour === 22 && hours < 2)) {
        if (hours >= startHour && hours < endHour) {
          return (this.selectedTime = this.timeOptions[i]);
        }
        if (startHour === 22 && (hours >= 22 || hours < 2)) {
          return (this.selectedTime = this.timeOptions[i]);
        }
      }
    }
    
    return (this.selectedTime = this.timeOptions[0]);
  }

  selectTime(time) {
    this.selectedTime = time;
    this.isNow = false;
  }

  reset() {
    const now = new Date();
    this.viewDate = now;
    this.selectedDate = now.toISOString();
    this.getSelectedTime();
    this.isNow = true;
  }

  confirm() {
    if (
      !this.selectedDate ||
      !this.selectedTime.start ||
      !this.selectedTime.end
    ) {
      return;
    }

    const date = new Date(this.selectedDate);
    const [startHour, startMinute] = this.selectedTime.start
      .split(':')
      .map(Number);
    const [endHour, endMinute] = this.selectedTime.end.split(':').map(Number);

    const startDate = new Date(date);
    startDate.setHours(startHour, startMinute, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(endHour, endMinute, 0, 0);

    this.modalCtrl.dismiss({
      selectedDate: this.viewDate,
      startDate: this.isNow
        ? new Date().toISOString()
        : startDate.toISOString(),
      endDate: this.isNow ? new Date().toISOString() : endDate.toISOString(),
    });
  }

  private setInitialSelectedTime() {
    const start = moment(this.initialStartDate);
    const end = moment(this.initialEndDate);

    const startStr = start.format('HH:mm');
    const endStr = end.format('HH:mm');

    const match = this.timeOptions.find(
      (t) => t.start === startStr && t.end === endStr
    );

    if (match) {
      this.selectedTime = match;
    } else {
      this.selectedTime = { start: startStr, end: endStr };
    }
  }

  isTimeSlotDisabled(item: { start: string; end: string }) {
    const selected = moment(this.viewDate).startOf('day');
    const today = moment().startOf('day');

    const oneWeekAgo = moment().subtract(6, 'days');
    const now = moment();

    const end = moment(item.end, 'HH:mm');
    const endWithDate = moment(oneWeekAgo)
      .hour(end.hour())
      .minute(end.minute())
      .second(0)
      .millisecond(0);
    if (
      selected.isSame(oneWeekAgo, 'day') &&
      endWithDate.isBefore(oneWeekAgo) &&
      item.end !== '00:00'
    ) {
      return true;
    }

    if (selected.isBefore(today)) return false;

    const start = moment(item.start, 'HH:mm');
    return start.isAfter(now);
  }
}
