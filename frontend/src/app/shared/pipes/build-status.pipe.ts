import { Pipe, PipeTransform } from '@angular/core';
import { BuildStatus } from '../models/build-status';

@Pipe({
  name: 'buildStatus',
})
export class BuildStatusPipe implements PipeTransform {
  transform(value: number): string {
    if (value <= BuildStatus.Passed) {
      return BuildStatus[value];
    }
    return value.toString();
  }
}
