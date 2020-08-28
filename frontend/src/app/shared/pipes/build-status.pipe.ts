import { Pipe, PipeTransform } from '@angular/core';
import { BuildStatus } from '../models/build-status';

@Pipe({
  name: 'buildStatus',
  // pure: false
})
export class BuildStatusPipe implements PipeTransform {
  transform(value: number): string {
    if (value <= BuildStatus.Pending) {
      return BuildStatus[value];
    }
    if (value == BuildStatus.InProgress) {
      return "In Progress";
    }
    return value.toString();
  }
}
