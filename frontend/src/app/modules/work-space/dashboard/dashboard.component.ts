import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectInfo } from '../../../shared/models/project-info';
import { ToastrNotificationsService } from 'src/app/services/toastr-notifications.service';
import { ProjectService } from '../../../core/services/project.service';
import { User } from '@shared/models/user';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  userProjects: ProjectInfo[];
  cachedUserProjects: ProjectInfo[];
  currentUser: User;
  loading = false;
  loadingProjects = false;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private projectService: ProjectService,
    private toastrService: ToastrNotificationsService
  ) {}

  ngOnInit(): void {
    this.getUserProjects(this.currentUser.id);
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
