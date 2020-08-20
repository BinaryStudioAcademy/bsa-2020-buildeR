import { Component, OnInit } from '@angular/core';
import { NewProjectTrigger} from '@shared/models/project/project-trigger/new-project-trigger';
import { UpdateTriggerCron } from '@shared/models/project/project-trigger/update-trigger-cron';
import { ProjectTrigger } from '@shared/models/project/project-trigger/project-trigger';
import { ProjectTriggerInfo } from '@shared/models/project/project-trigger/project-trigger-info';
import { TriggerService } from '@core/services/trigger.service';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-triggers',
  templateUrl: './project-triggers.component.html',
  styleUrls: ['./project-triggers.component.sass']
})
export class ProjectTriggersComponent implements OnInit {
  projectId: number;
  branches: string [] = ['master', 'dev'];
  selectedBranch: string;
  runOnShedule = false;
  triggers: ProjectTriggerInfo[] = [];
  constructor(
    private triggerService: TriggerService,
    private toastrService: ToastrNotificationsService,
    private route: ActivatedRoute
    )
    {
      route.parent.params.subscribe(
        (params) => this.projectId = params.projectId);
    }
  ngOnInit(): void {
    this.getTriggers();
  }

  getTriggers() {
    this.triggerService.getTriggersByProjectId(this.projectId).subscribe(
      (data) => this.triggers = data,
      (error) => this.toastrService.showError(error.message, error.name)
    );
  }

  createTrigger(cron: string)  {
    if (this.selectedBranch) {

     const newTrigger: NewProjectTrigger = {
       projectId: this.projectId,
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
  updateTrigger(upTrigger: UpdateTriggerCron) {

    const findTrigger = this.triggers.find(t => t.id === upTrigger.id);

    const trigger: ProjectTrigger = {
      id: findTrigger.id,
      projectId: findTrigger.projectId,
      branchHash: findTrigger.branchHash,
      cronExpression: upTrigger.cronExpression
    };

    const index = this.triggers.findIndex(t => t.id === upTrigger.id);
    this.triggerService.updateTrigger(trigger).subscribe(
      (data) => {
        this.triggers.splice(index, 1, data);
        this.toastrService.showSuccess('trigger updated');
      },
      (error) => this.toastrService.showError(error.message, error.name)
    );

  }
  deleteTrigger(id: number) {

    this.triggerService.deleteTrigger(id).subscribe(
      (data) => {
        this.triggers = this.triggers.filter(x => x.id !== id);
        this.toastrService.showSuccess('trigger deleted');
      },
      (error) => this.toastrService.showError(error.message, error.name)
    );
  }
  onToggle(change: boolean) {
    change = !change;
  }
  compareToMinDate(date: Date){
    const minDate: Date = new Date('2000-01-01');
    const thisDate: Date = new Date(date);
    if (minDate < thisDate) {
      return true;
    }
    return false;
  }
}
