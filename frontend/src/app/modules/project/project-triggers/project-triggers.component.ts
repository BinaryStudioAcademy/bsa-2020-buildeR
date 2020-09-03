import { Component, OnInit } from '@angular/core';
import { NewProjectTrigger } from '@shared/models/project/project-trigger/new-project-trigger';
import { ProjectTriggerInfo } from '@shared/models/project/project-trigger/project-trigger-info';
import { TriggerService } from '@core/services/trigger.service';
import { SynchronizationService } from '@core/services/synchronization.service';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { ActivatedRoute } from '@angular/router';
import { Branch } from '@core/models/Branch';
import { ProjectService } from '@core/services/project.service';
import { Project } from '@shared/models/project/project';
import { CronJobsConfig } from 'ngx-cron-jobs/src/app/lib/contracts/contracts';

@Component({
  selector: 'app-project-triggers',
  templateUrl: './project-triggers.component.html',
  styleUrls: ['./project-triggers.component.sass']
})
export class ProjectTriggersComponent implements OnInit {
  project: Project;
  branches: Branch[];
  selectedBranch: string;
  runOnSchedule = false;
  triggers: ProjectTriggerInfo[] = [];

  cronConfig: CronJobsConfig = {quartz: true, option: { minute: false, year: false } };
  cronResult: string;

  constructor(
    private triggerService: TriggerService,
    private toastrService: ToastrNotificationsService,
    private route: ActivatedRoute,
    private projectSerivce: ProjectService,
    private syncService: SynchronizationService
  ) { }

  ngOnInit(): void {
    this.projectSerivce.getProjectById(this.route.parent.snapshot.params.projectId)
      .subscribe(project => {
        this.project = project;
        this.syncService.getRepositoryBranches(project.id)
            .subscribe(branches => this.branches = branches);
      });
    this.getTriggers(this.route.parent.snapshot.params.projectId);
  }

  getTriggers(projectId: number) {
    this.triggerService.getTriggersByProjectId(projectId).subscribe(
      (data) => this.triggers = data,
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
      console.log(newTrigger.cronExpression);
      this.triggerService.createTrigger(newTrigger).subscribe(
        (data) => {
          console.log(data);

          this.triggers.push(data);
          this.toastrService.showSuccess('trigger created');
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
        this.toastrService.showSuccess('trigger updated');
      },
      (error) => this.toastrService.showError(error.message, error.name)
    );

  }

  deleteTrigger(trigger: ProjectTriggerInfo) {
    this.triggerService.deleteTrigger(trigger.id).subscribe(
      () => {
        this.triggers = this.triggers.filter(x => x.id !== trigger.id);
        this.toastrService.showSuccess('trigger deleted');
      },
      (error) => this.toastrService.showError(error.message, error.name)
    );
  }

  onToggle(change: boolean) {
    change = !change;
    console.log(change);
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
