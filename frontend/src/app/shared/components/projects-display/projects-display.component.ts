import { Component, OnInit, Input} from '@angular/core';
import { ProjectInfo } from '@shared/models/project-info';
import { BuildHistory } from '@shared/models/build-history';
import { Branch } from '@core/models/Branch';
import { NewBuildHistory } from '@shared/models/new-build-history';
import { AuthenticationService } from '@core/services/authentication.service';
import { User } from '@shared/models/user/user';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { ProjectService } from '@core/services/project.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SynchronizationService } from '@core/services/synchronization.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@core/components/base/base.component';
import { Permissions } from '@shared/models/permissions';

@Component({
  selector: 'app-projects-display',
  templateUrl: './projects-display.component.html',
  styleUrls: ['./projects-display.component.sass']
})


export class ProjectsDisplayComponent extends BaseComponent implements OnInit   {
  @Input() activeProjects: ProjectInfo[];
  @Input() permissions: Permissions;
  user: User = this.authService.getCurrentUser();
  loadingSelectedProjectBranches = false;

  selectedProjectBranch: string;
  selectedProjectBranches: Branch[];
  constructor(private authService: AuthenticationService,
              private toastr: ToastrNotificationsService,
              private projectService: ProjectService,
              private modalService: NgbModal,
              private syncService: SynchronizationService) {
                super();
               }

  ngOnInit(): void {
  }

  getCommit(bh: BuildHistory) {
    return bh.commitHash?.substring(0, 6) ?? '—';
  }

  changeFavoriteStateOfProject(project: ProjectInfo){
    this.projectService.sendStarProject(project);
  }


  triggerBuild(project: ProjectInfo) {
    const newBuildHistory = {
      branchHash: this.selectedProjectBranch,
      performerId: this.user.id,
      projectId: project.id,
      commitHash: null,
    } as NewBuildHistory;
    this.closeModal();
    this.toastr.showSuccess(
      `You’ve successfully triggered a build for ${newBuildHistory.branchHash} branch of ${project.name}. Hold tight, it might take a moment to show up.`
    );
    this.projectService
      .startProjectBuild(newBuildHistory)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (buildHistory) => {
          project.lastBuildHistory = buildHistory;
        },
        (error) => this.toastr.showError(error)
      );
  }

  closeModal() {
    this.modalService.dismissAll('Closed');
  }


  openBranchSelectionModal(content, projectId: number) {
    this.loadProjectBranches(projectId);
    this.modalService
      .open(content)
      .result.then(() => {})
      .catch(() => {});
  }

  loadProjectBranches(projectId: number) {
    this.loadingSelectedProjectBranches = true;
    this.syncService
      .getRepositoryBranches(projectId)
      .subscribe(
        (resp) => {
          this.selectedProjectBranches = resp;
          this.loadingSelectedProjectBranches = false;
        },
        (error) => {
          this.toastr.showError(error);
          this.loadingSelectedProjectBranches = false;
        }
      );
  }

  async deleteProject(projectId: number) {
    this.projectService.sendDeleteProject(projectId);
   }

  copyProject(id: number) {
    this.projectService.sendCopyProject(id);
  }
}
