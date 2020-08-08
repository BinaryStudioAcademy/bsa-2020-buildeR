import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectInfo } from '@shared/models/project-info';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { ProjectService } from '@core/services/project.service';
import { User } from '@shared/models/user';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@core/components/base/base.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent extends BaseComponent
  implements OnInit, OnDestroy {
  userProjects: ProjectInfo[];
  cachedUserProjects: ProjectInfo[];
  currentUser: User;
  loadingProjects = false;

  constructor(
    private projectService: ProjectService,
    private toastrService: ToastrNotificationsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem(`user`));
    if (this.currentUser) {
      console.log(this.currentUser);
      this.getUserProjects(this.currentUser.id);
    } else {
      this.toastrService.showError('Undefined user');
    }
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
        },
        (error) => {
          this.loadingProjects = false;
          this.toastrService.showError(error);
        }
      );
  }

  triggerBuild(projectId: number) {
    throw new Error('Method not implemented.');
  }

  addProject() {
    throw new Error('Method not implemented.');
  }
}
