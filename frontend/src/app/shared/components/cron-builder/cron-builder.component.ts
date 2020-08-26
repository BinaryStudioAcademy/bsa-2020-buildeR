import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

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
