import { Component, OnInit } from '@angular/core';
import { NewProjectTrigger} from '@shared/models/project/new-project-trigger';
import { Project } from '@shared/models/project/project';
import { TriggerService } from '@core/services/trigger.service';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';

@Component({
  selector: 'app-project-triggers',
  templateUrl: './project-triggers.component.html',
  styleUrls: ['./project-triggers.component.sass']
})
export class ProjectTriggersComponent implements OnInit {

  currentProject: Project = {} as Project;
  branches: string [] = ['master', 'dev'];
  selectedBranch: string;
  runOnShedule = true;

  constructor(
    private triggerService: TriggerService,
    private toastrService: ToastrNotificationsService)
    { }

  ngOnInit(): void {
  }

  createTrigger(cron: string)  {
    if (this.selectedBranch) {

     const newTrigger: NewProjectTrigger = {
       projectId: this.currentProject.id.toString(),
       branchHash: this.selectedBranch,
       cronExpression: cron
      };

     this.triggerService.createTrigger(newTrigger).subscribe(
        () => this.toastrService.showSuccess('project created'),
        (error) => this.toastrService.showError(error.message, error.name)
      );
    }
  }

  onToggle(change: boolean) {
    change = !change;
  }
}
