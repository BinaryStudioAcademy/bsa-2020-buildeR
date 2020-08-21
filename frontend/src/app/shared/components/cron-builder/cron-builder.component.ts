import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { UpdateTriggerCron } from '@shared/models/project/project-trigger/update-trigger-cron';
import { CronJobsConfig } from 'ngx-cron-jobs/src/app/lib/contracts/contracts';

@Component({
  selector: 'app-cron-builder',
  templateUrl: './cron-builder.component.html',
  styleUrls: ['./cron-builder.component.sass']
})

export class CronBuilderComponent implements OnInit {


  cronConfig: CronJobsConfig = {quartz: true,
    option: { minute: false } };
  cronResult: string;
  @Input() cronInput: string;
  @Input() triggerId: number;
  @Output() cronSetUp = new EventEmitter<string>();
  @Output() updateEv = new EventEmitter<UpdateTriggerCron>();
  @Output() deleteEv = new EventEmitter<number>();

  constructor() {
   }

   ngOnInit(): void {
    if (this.cronInput) {
      this.cronResult = this.cronInput;
    }
  }
  saveBuildPeriod() {
    this.cronSetUp.emit(this.cronResult);
  }
  updating() {
    const upTr: UpdateTriggerCron = {
      id: this.triggerId,
      cronExpression: this.cronResult
    };
    this.updateEv.emit(upTr);
  }
  deleting() {
    this.deleteEv.emit(this.triggerId);
  }
}
