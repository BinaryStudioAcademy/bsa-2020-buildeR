import { Component, Input, OnInit } from '@angular/core';
import { NewProjectTrigger } from '@shared/models/project/project-trigger/new-project-trigger';
import { ProjectTriggerInfo } from '@shared/models/project/project-trigger/project-trigger-info';
import { TriggerService } from '@core/services/trigger.service';
import { RemoteTriggerService } from '@core/services/remote-trigger.service';
import { SynchronizationService } from '@core/services/synchronization.service';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { Project } from '@shared/models/project/project';
import { CronJobsConfig } from 'ngx-cron-jobs/src/app/lib/contracts/contracts';
import { RemoteTrigger } from '@shared/models/remote-trigger/remote-trigger';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@core/components/base/base.component';

@Component({
  selector: 'app-project-triggers',
  templateUrl: './project-triggers.component.html',
  styleUrls: ['./project-triggers.component.sass']
})
export class ProjectTriggersComponent extends BaseComponent implements OnInit {
  @Input() project: Project;

  branches: string[];
  selectedBranch: string;
  runOnSchedule = false;
  triggers: ProjectTriggerInfo[];

  cronConfig: CronJobsConfig = { quartz: true, option: { minute: false, year: false } };
  cronResult: string;

  remoteTriggersSection: boolean;
  remoteTriggers: RemoteTrigger[];

  constructor(
    private triggerService: TriggerService,
    private remoteTriggerService: RemoteTriggerService,
    private toastrService: ToastrNotificationsService,
    private syncService: SynchronizationService
  ) {
    super();
  }

  ngOnInit() {
    this.syncService.getRepositoryBranches(this.project.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(branches => {
        this.branches = branches.map(b => b.name);
        this.selectedBranch = this.branches?.[0];
      });
    this.getTriggers(this.project.id);
  }

  getTriggers(projectId: number) {
    this.triggerService.getTriggersByProjectId(projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data) => this.triggers = data,
        (error) => this.toastrService.showError(error.message, error.name)
      );

    this.remoteTriggerService.getProjectRemoteTriggers(projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data) => {
          this.remoteTriggers = data;
          if (this.remoteTriggers.length) {
            this.remoteTriggersSection = true;
          }
        },
        (error) => this.toastrService.showError(error.message, error.name)
      );
  }

  createTrigger(cron: string) {
    if (this.selectedBranch) {

      const newTrigger: NewProjectTrigger = {
        projectId: this.project.id,
        branchHash: this.selectedBranch,
        cronExpression: cron
      };
      this.triggerService.createTrigger(newTrigger).subscribe(
        (data) => {
          this.triggers.push(data);
          this.toastrService.showSuccess('Trigger has been successfully created');
        },
        (error) => this.toastrService.showError(error.message, error.name)
      );
    }
  }

  updateTrigger(trigger: ProjectTriggerInfo) {
    const index = this.triggers.findIndex(t => t.id === trigger.id);
    this.triggerService.updateTrigger(trigger).subscribe(
      (data) => {
        this.triggers.splice(index, 1, data);
        this.toastrService.showSuccess('Trigger has been successfully updated');
      },
      (error) => this.toastrService.showError(error.message, error.name)
    );

  }

  deleteTrigger(trigger: ProjectTriggerInfo) {
    this.triggerService.deleteTrigger(trigger.id).subscribe(
      () => {
        this.triggers = this.triggers.filter(x => x.id !== trigger.id);
        this.toastrService.showSuccess('Trigger has been successfully deleted');
      },
      (error) => this.toastrService.showError(error.message, error.name)
    );
  }

  createRemoteTrigger(trigger: RemoteTrigger) {
    trigger.projectId = this.project.id;

    this.remoteTriggerService.addRemoteTrigger(trigger)
      .subscribe(
        (createdTrigger) => {
          this.remoteTriggers.push(createdTrigger);
          this.toastrService.showSuccess('Branch trigger was created');
        },
        (error) => this.toastrService.showError(error.message, error.name)
      );
  }

  updateRemoteTrigger(trigger: RemoteTrigger) {
    this.remoteTriggerService.updateRemoteTrigger(trigger)
      .subscribe(
        (updatedTrigger) => this.toastrService.showSuccess('Branch trigger was updated'),
        (error) => this.toastrService.showError(error.message, error.name)
      );
  }

  deleteRemoteTrigger(triggerId: number) {
    this.remoteTriggers = this.remoteTriggers.filter(t => t.id !== triggerId);

    this.remoteTriggerService.deleteRemoteTrigger(triggerId)
      .subscribe(
        () => this.toastrService.showSuccess('Branch trigger was deleted'),
        (error) => this.toastrService.showError(error.message, error.name)
      );
  }

  onToggle(change: boolean) {
    change = !change;
  }

  compareToMinDate(date: Date) {
    const minDate: Date = new Date('2000-01-01');
    const thisDate: Date = new Date(date);
    if (minDate < thisDate) {
      return true;
    }
    return false;
  }
}
