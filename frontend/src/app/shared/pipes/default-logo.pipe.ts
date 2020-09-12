import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultLogo'
})
export class DefaultLogoPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return value || 'assets/images/Avatar-default.png';
  }

}
