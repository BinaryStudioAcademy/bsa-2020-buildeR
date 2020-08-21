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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent extends BaseComponent
  implements OnInit, OnDestroy {
  activeProjects: ProjectInfo[];
  starredProjects: ProjectInfo[];
  cachedUserProjects: ProjectInfo[];
  currentUser: User;
  currentGithubUser: SynchronizedUser;
  loadingProjects = false;

  constructor(
    private projectService: ProjectService,
    private toastrService: ToastrNotificationsService,
    private authService: AuthenticationService,
    private githubService: SynchronizationService,
    private modalService: NgbModal
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadingProjects = true;
    this.currentUser = this.authService.getCurrentUser();
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
          this.activeProjects = resp.body.filter(project => !project.isFavorite);
          this.starredProjects = resp.body.filter(project => project.isFavorite);
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
            this.activeProjects = this.activeProjects.filter(proj => proj.id !== project.id);
            this.starredProjects.push(project);
          }
          else {
            this.activeProjects.push(project);
            this.starredProjects = this.starredProjects.filter(proj => proj.id !== project.id);
          }
        },
        (error) => this.toastrService.showError(error)
      );
  }

  deleteProject(projectId: number) {
    const modalRef = this.modalService.open(ModalContentComponent);
    const data = {
      title: 'Are you sure?',
      message: 'You are going to delete project.',
      text: 'Press "yes" button to confirm deleting project or "no" button to come back.'
    };
    modalRef.componentInstance.content = data;
    modalRef.result
      .then((result) => {
        if (result) {
          this.projectService.deleteProject(projectId).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.activeProjects = this.activeProjects.filter(proj => proj.id !== projectId);
            this.starredProjects = this.starredProjects.filter(proj => proj.id !== projectId);
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  copyProject(id: number) {
    const modalRef = this.modalService.open(ModalCopyProjectComponent);
    modalRef.componentInstance.id = id;
    modalRef.result
      .then((result) => {
        if (result.isFavorite) {
          this.starredProjects.push(result);
          this.activeProjects.push(result);
        }
        else if (result) {
          this.activeProjects.push(result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  openCreateProjectModal() {
    const modalRef = this.modalService.open(ProjectCreateComponent);
    modalRef.result
      .then(() => this.getUserProjects(this.currentUser.id))
      .catch(() => { });
  }
}
