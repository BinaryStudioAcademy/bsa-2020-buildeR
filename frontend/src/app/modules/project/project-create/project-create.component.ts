import { Component, OnInit } from '@angular/core';
import { NewProject } from '@shared/models/project/new-project';
import { ProjectService } from '@core/services/project.service';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.sass']
})
export class ProjectCreateComponent implements OnInit {

  newProject: NewProject;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private toastrService: ToastrNotificationsService
              )
    { }

  ngOnInit(): void {
    this.defaultValues();
  }
  defaultValues() {
    this.newProject = {
      name: '',
      description: '',
      isPublic: true,
      repositoryUrl: ''
    };
  }
  save() {
    this.projectService.createProject(this.newProject).subscribe(
      (resp) => {
        this.toastrService.showSuccess('project created');
      },
      (error) => {
        this.toastrService.showError(error.message, error.name);
      }
    );
    this.router.navigate(['portal/dashboard']);
  }
  cancel() {
    this.router.navigate(['portal/dashboard']);
  }
  onToggle(change: boolean) {
    change = !change;
  }
}
