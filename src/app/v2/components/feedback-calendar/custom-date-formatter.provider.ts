import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {
  public override monthViewTitle({ date, locale }: DateFormatterParams): string {
    return formatDate(date, 'MMMM', locale || 'en');
  }

  public override monthViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return formatDate(date, 'EEE', locale || 'en');
  }
  
  public override weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
    const dayName = formatDate(date, 'EEE', locale || 'en');
    return dayName.charAt(0);
  }

  public override weekViewColumnSubHeader({ date, locale }: DateFormatterParams): string {
    return formatDate(date, 'd', locale || 'en');
  }

  public override dayViewHour({ date, locale }: DateFormatterParams): string {
    return formatDate(date, 'H:mm', locale || 'en');
  }
}