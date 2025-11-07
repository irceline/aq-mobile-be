import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';

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
export class CalendarTemplateComponent {
  @Input()
  getDate!: (date: Date) => Boolean;
  @Output()
  changeDay: EventEmitter<any> = new EventEmitter();
  @Input()
  viewDate!: Date;
  selectedDate: Date | null = null;

  constructor() {}

  onChangeDay(date: Date) {
    this.changeDay.emit(date);
    this.selectedDate = date;
  }
}
