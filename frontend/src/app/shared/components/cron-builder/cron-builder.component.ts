import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-cron-builder',
  templateUrl: './cron-builder.component.html',
  styleUrls: ['./cron-builder.component.sass']
})
export class CronBuilderComponent {

  cronResult: string;
  @Output() cronSetUp = new EventEmitter<string>();

  constructor() { }

  saveBuildPeriod() {
    this.cronSetUp.emit(this.cronResult);
  }
}
