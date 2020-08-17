import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectInfo } from '@shared/models/project-info';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { ProjectService } from '@core/services/project.service';
import { User } from '@shared/models/user/user';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@core/components/base/base.component';
import { AuthenticationService } from '@core/services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent extends BaseComponent
  implements OnInit, OnDestroy {
  userProjects: ProjectInfo[];
  starredProjects: ProjectInfo[];
  cachedUserProjects: ProjectInfo[];
  currentUser: User;
  loadingProjects = false;

  constructor(
    private projectService: ProjectService,
    private toastrService: ToastrNotificationsService,
    private authService: AuthenticationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.getUserProjects(this.currentUser.id);
  }

  getUserProjects(userId: number) {
    this.loadingProjects = true;
    this.projectService
      .getProjectsByUser(userId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (resp) => {
          this.loadingProjects = false;
          this.cachedUserProjects = this.userProjects = resp.body;
          this.starredProjects = this.userProjects.filter(project => project.isFavorite);
        },
        (error) => {
          this.loadingProjects = false;
          this.toastrService.showError(error);
        }
      );
  }

  triggerBuild(projectId: number) {
    this.projectService
      .startProjectBuild(projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        () => projectId,
        (error) => this.toastrService.showError(error)
      );
  }

  changeFavoriteStateOfProject(project: ProjectInfo) {
    this.projectService
      .changeFavoriteState(project.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        () => {
          project.isFavorite = !project.isFavorite;
          if (project.isFavorite) {
            this.starredProjects.push(project);
          }
          else {
            this.starredProjects = this.starredProjects.filter(proj => proj.id !== project.id);
          }
        },
        (error) => this.toastrService.showError(error)
      );
  }
}
