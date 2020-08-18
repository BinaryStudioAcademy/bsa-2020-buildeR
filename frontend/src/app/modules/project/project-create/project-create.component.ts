import { Component, OnInit } from '@angular/core';
import { NewProject } from '@shared/models/project/new-project';
import { ProjectService } from '@core/services/project.service';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { User } from '../../../shared/models/user/user';
import { SynchronizationService } from '@core/services/synchronization.service';
import { Repository } from '@core/models/Repository';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.sass'],
})
export class ProjectCreateComponent implements OnInit {
  newProject: NewProject;
  user: User = this.authService.getCurrentUser();
  repositories: Repository[];

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private toastrService: ToastrNotificationsService,
    private authService: AuthenticationService,
    private syncService: SynchronizationService
  ) {}

  ngOnInit(): void {
    this.defaultValues();
    this.syncService.getUserRepositories()
      .subscribe(repos => {
        this.repositories = repos;
        console.log(repos);
      });
  }
  defaultValues() {
    this.newProject = {
      name: '',
      description: '',
      isPublic: true,
      repository: '',
      ownerId: this.user.id,
    };
  }
  save() {
    this.projectService.createProject(this.newProject).subscribe(
      (resp) => {
        this.toastrService.showSuccess('project created');
        this.router.navigate(['portal']);
      },
      (error) => {
        this.toastrService.showError(error.message, error.name);
      }
    );
  }
  cancel() {
    this.router.navigate(['portal']);
  }
  onToggle(change: boolean) {
    change = !change;
  }
}
