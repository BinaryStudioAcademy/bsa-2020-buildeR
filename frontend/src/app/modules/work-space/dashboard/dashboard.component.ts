import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectInfo } from '@shared/models/project-info';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { ProjectService } from '@core/services/project.service';
import { User } from '@shared/models/user/user';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@core/components/base/base.component';
import { AuthenticationService } from '@core/services/authentication.service';
import { SynchronizationService } from '@core/services/synchronization.service';
import { SynchronizedUser } from '@core/models/SynchronizedUser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentComponent } from '../../../core/components/modal-content/modal-content.component';
import { ModalCopyProjectComponent } from '../../project/modal-copy-project/modal-copy-project.component';
import { ProjectCreateComponent } from '@modules/project/project-create/project-create.component';
import { Branch } from '@core/models/Branch';
import { BuildHistory } from '@shared/models/build-history';
import { BuildStatusesSignalRService } from '@core/services/build-statuses-signalr.service';
import { BuildStatus } from '@shared/models/build-status';
import { BuildHistoryService } from '@core/services/build-history.service';
import { UsersGroupProjects } from '@shared/models/users-group-projects';
import { GroupRole } from '@shared/models/group/group-role';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent
  extends BaseComponent
  implements OnInit, OnDestroy {
  GroupRole = GroupRole;

  activeProjects: ProjectInfo[];
  starredProjects: ProjectInfo[];
  groupsProjects: UsersGroupProjects[] = [];
  cachedUserProjects: ProjectInfo[];
  currentUser: User;
  currentGithubUser: SynchronizedUser;
  loadingProjects = false;
  loadingGroupsProjects = false;
  tab: 'myprojects' | 'groupsprojects' | 'history' = 'myprojects';

  selectedProjectBranches: Branch[];
  loadingSelectedProjectBranches = false;
  selectedProjectBranch: string;

  constructor(
    private projectService: ProjectService,
    private toastrService: ToastrNotificationsService,
    private authService: AuthenticationService,
    private githubService: SynchronizationService,
    private modalService: NgbModal,
    private syncService: SynchronizationService,
    private buildHistoryService: BuildHistoryService,
    private buildStatusesSignalRService: BuildStatusesSignalRService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadingProjects = true;
    this.currentUser = this.authService.getCurrentUser();
    this.getUserProjects(this.currentUser.id);
    this.projectService.getStarProject().pipe(takeUntil(this.unsubscribe$)).subscribe((res) => this.changeFavoriteStateOfProject(res));
    this.projectService.getDeleteProject().pipe(takeUntil(this.unsubscribe$)).subscribe((res) => this.deleteProject(res));
    this.projectService.getCopyProject().pipe(takeUntil(this.unsubscribe$)).subscribe((res) => this.copyProject(res));
    this.configureBuildStatusesSignalR();
    this.projectService
      .notOwnGroupsProjectsByUser(this.currentUser.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (resp) => {
          this.loadingGroupsProjects = false;
          this.groupsProjects = resp;
        },
        (error) => {
          this.loadingGroupsProjects = false;
          this.toastrService.showError(error.error, error.name);
        }
      );
  }

  private configureBuildStatusesSignalR() {
    this.buildStatusesSignalRService.connect();
    this.buildStatusesSignalRService.listen().subscribe((statusChange) => {
      const projectsToUpdate = [
        ...this.starredProjects,
        ...this.activeProjects,
        ...([] as ProjectInfo[]).concat(...this.groupsProjects.map(gp => gp.groupProjects.projects))
      ].filter(pi => pi.lastBuildHistory?.id === statusChange.BuildHistoryId);
      if (projectsToUpdate) {
        projectsToUpdate.forEach(p => {
          delete p.lastBuildHistory.buildStatus;
          p.lastBuildHistory.buildStatus = statusChange.Status;
        });
        if (statusChange.Status !== BuildStatus.InProgress) {
          this.buildHistoryService.getBuildHistory(statusChange.BuildHistoryId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((bh) => {
              projectsToUpdate.forEach(p => p.lastBuildHistory = bh);
            });
        }
      }
    });
  }

  getUserProjects(userId: number) {
    this.loadingProjects = true;
    this.projectService
      .getProjectsByUser(userId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (resp) => {
          this.loadingProjects = false;
          this.activeProjects = resp.body.filter(
            (project) => !project.isFavorite
          );
          this.starredProjects = resp.body.filter(
            (project) => project.isFavorite
          );
        },
        (error) => {
          this.loadingProjects = false;
          this.toastrService.showError(error.error, error.name);
        }
      );
  }

  gotoGroupsProjects() {
    this.tab = 'groupsprojects';
    this.loadingGroupsProjects = true;
    this.projectService
      .notOwnGroupsProjectsByUser(this.currentUser.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (resp) => {
          this.loadingGroupsProjects = false;
          this.groupsProjects = resp;
        },
        (error) => {
          this.loadingGroupsProjects = false;
          this.toastrService.showError(error.error, error.name);
        }
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
            this.activeProjects = this.activeProjects.filter(
              (proj) => proj.id !== project.id
            );
            this.starredProjects.push(project);
          } else {
            this.activeProjects.push(project);
            this.starredProjects = this.starredProjects.filter(
              (proj) => proj.id !== project.id
            );
          }
        },
        (error) => this.toastrService.showError(error.error, or err.name)
      );
  }

  deleteProject(projectId: number) {
    const modalRef = this.modalService.open(ModalContentComponent);
    const data = {
      title: 'Project deletion',
      message: 'Are you sure you want to delete this project?',
      text:
        'All information associated to this project will be permanently deleted. This operation can not be undone.',
    };
    modalRef.componentInstance.content = data;
    modalRef.result
      .then((result) => {
        if (result) {
          this.projectService
            .deleteProject(projectId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
              this.activeProjects = this.activeProjects.filter(
                (proj) => proj.id !== projectId
              );
              this.starredProjects = this.starredProjects.filter(
                (proj) => proj.id !== projectId
              );
            });
        }
      })
      .catch((error) => { });
  }

  copyProject(id: number) {
    const modalRef = this.modalService.open(ModalCopyProjectComponent);
    modalRef.componentInstance.id = id;
    modalRef.result
      .then((result) => {
        if (result.isFavorite) {
          this.starredProjects.push(result);
        } else if (result) {
          this.activeProjects.push(result);
        }
      })
      .catch((error) => { });
  }

  openCreateProjectModal() {
    const modalRef = this.modalService.open(ProjectCreateComponent);
    modalRef.result
      .then(() => this.getUserProjects(this.currentUser.id))
      .catch(() => { });
  }

  closeModal() {
    this.modalService.dismissAll('Closed');
  }

  getCommit(bh: BuildHistory) {
    return bh.commitHash?.substring(0, 6) ?? '—';
  }

  hasBuild() {
    return this.activeProjects.filter(p => p.lastBuildHistory)?.length
      || this.starredProjects.filter(p => p.lastBuildHistory)?.length
      || this.groupsProjects.filter(p => p.groupProjects.projects
        .filter(build => build.lastBuildHistory)?.length)?.length;
  }

  hasGroupsProjects() {
    return this.groupsProjects.length > 0 || this.groupsProjects
      .reduce((sum, gp) => sum + gp.groupProjects.projects.length, 0) > 0;
  }
}
