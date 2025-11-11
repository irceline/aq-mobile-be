import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { BelAQIService } from '../../services/bel-aqi.service';
import { ThemeHandlerService } from '../../services/theme-handler/theme-handler.service';

/**
 * Generated class for the CalendarTemplateComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'calendar-template',
  templateUrl: 'calendar-template.html',
  styleUrls: ['./calendar-template.scss'],
})
export class CalendarTemplateComponent implements OnInit {
  @Input()
  getDate!: (date: Date) => Boolean;
  @Output()
  changeDay: EventEmitter<any> = new EventEmitter();
  @Input()
  viewDate!: Date;
  @Input()
  color = '';
  selectedDate: Date | null = null;
  isContrastMode: boolean = false;

  constructor(
    private themeHandlerService: ThemeHandlerService
  ) {}

  ngOnInit() {
    this.themeHandlerService.getActiveTheme().then((theme) => {
      this.isContrastMode = theme === this.themeHandlerService.CONTRAST_MODE;
    });
  }

  onChangeDay(date: Date) {
    this.changeDay.emit(date);
    this.selectedDate = date;
  }

  getCellStyle(date: Date) {
    if (this.getDate(date)) {
      return {
        'background-color': this.color,
        'border-radius': '8px',
      };
    }
    if (date.getDate() === new Date().getDate()) {
      return {
        border: `1px solid ${this.color}`,
        'border-radius': '8px',
      };
    }
    return {};
  }

  getDayNumberStyle(date: Date) {
    if (this.getDate(date) && !this.isContrastMode) {
      return {
        color: 'white',
      };
    }
    return {
      color: 'var(--font-color)',
    };
  }
}
