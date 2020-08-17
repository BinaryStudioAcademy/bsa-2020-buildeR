import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { UpdateTriggerCron } from '@shared/models/project/project-trigger/update-trigger-cron';
@Component({
  selector: 'app-cron-builder',
  templateUrl: './cron-builder.component.html',
  styleUrls: ['./cron-builder.component.sass']
})
export class CronBuilderComponent implements OnInit {

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
      this.cronResult = this.checkCronInput(this.cronInput);
    }
  }
  saveBuildPeriod() {
    this.cronSetUp.emit(this.checkCronToCorect(this.cronResult));
    this.cronResult = '';
  }
  updating() {
    const upTr: UpdateTriggerCron = {
      id: this.triggerId,
      cronExpression: this.checkCronToCorect(this.cronResult)
    };
    this.updateEv.emit(upTr);
  }
  deleting() {
    this.deleteEv.emit(this.triggerId);
  }
  checkCronToCorect(cron: string) {                             // it is solution for the difference between
    if (Number(cron[cron.length - 1])) {                        // cron-jobs have "Day of week" 0-6 (Sunday thru Saturday)
      const lastElement = Number(cron[cron.length - 1]) + 1;    // quartz CronTrigger "Day of week" 1-7 or SUN-SAT
      cron = cron.slice(0, -1);        // delete last element
      cron += lastElement;             // add new last element
    }
    cron += ' ?';
    return cron;
  }
  checkCronInput(cron: string) {
    cron = cron.replace(' ?', '');
    if (Number(cron[cron.length - 1])) {
      const lastElement = Number(cron[cron.length - 1]) - 1;
      cron = cron.slice(0, -1);
      cron += lastElement;
    }
    return cron;
  }
}
