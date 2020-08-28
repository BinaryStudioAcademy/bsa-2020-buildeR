import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateAgo',
})
export class DateAgoPipe implements PipeTransform {
  transform(date: Date | null): string {
    if (date && date != new Date()) {
    return moment(date).fromNow();
    } else {
      return "—";
    }
  }
}
