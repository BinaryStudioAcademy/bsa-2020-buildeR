import { Project } from 'src/app/shared/models/project/project';
import { Component, OnInit } from '@angular/core';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { ProjectService } from '@core/services/project.service';
import {
  ActivatedRoute,
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { TabRoute } from '@shared/models/tabs/tab-route';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SynchronizationService } from '@core/services/synchronization.service';
import { Branch } from '@core/models/Branch';
import { BaseComponent } from '@core/components/base/base.component';
import { NewBuildHistory } from '@shared/models/new-build-history';
import { AuthenticationService } from '@core/services/authentication.service';
import { User } from '@shared/models/user/user';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.sass'],
})
export class ProjectComponent extends BaseComponent implements OnInit{
  id: number;
  project: Project = {} as Project;
  isLoading = false;
  currentUser: User;

  loadingSelectedProjectBranches = false;
  selectedProjectBranches: Branch[];
  selectedProjectBranch: string;

  tabRoutes: TabRoute[] = [
    { name: 'Current', route: 'details' },
    { name: 'Build History', route: 'history' },
    { name: 'Build Steps', route: 'steps' },
    { name: 'Settings', route: 'settings' },
  ];

  constructor(
    private projectService: ProjectService,
    private toastrService: ToastrNotificationsService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private syncService: SynchronizationService,
    private authService: AuthenticationService,
  ) {
    super();
    this.route.paramMap
      .pipe(switchMap((params) => params.getAll('projectId')))
      .subscribe((data) => (this.id = Number(data)));
    this.projectService.projectName.subscribe((res) => {
      this.project.name = res;
    });
    this.route.data.subscribe((res) => {
      this.project = res.project;
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.getProject(this.id);
  }
  getProject(projectId: number) {
    this.isLoading = true;
    this.projectService.getProjectById(projectId).subscribe(
      (data) => {
        this.isLoading = false;
        this.project = data;
      },
      (error) => {
        this.isLoading = false;
        this.toastrService.showError(error.message, error.name);
      }
    );
  }

  triggerBuild() {
    const newBuildHistory = {
      branchHash: this.selectedProjectBranch,
      performerId: this.currentUser.id,
      projectId: this.project.id,
      commitHash: null,
    } as NewBuildHistory;
    this.closeModal();
    this.toastrService.showSuccess(
      `You’ve successfully triggered a build for ${newBuildHistory.branchHash} branch of ${this.project.name}. Hold tight, it might take a moment to show up.`
    );
    this.projectService
      .startProjectBuild(newBuildHistory)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (buildHistory) => {
        },
        (error) => this.toastrService.showError(error)
      );
  }

  openBranchSelectionModal(content, projectId: number) {
    this.loadProjectBranches(projectId);
    this.modalService
      .open(content)
      .result.then(() => {})
      .catch(() => {});
  }

  closeModal() {
    this.modalService.dismissAll('Closed');
  }

  loadProjectBranches(projectId: number) {
    this.loadingSelectedProjectBranches = true;
    this.syncService
      .getRepositoryBranches(projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (resp) => {
          this.selectedProjectBranches = resp;
          this.loadingSelectedProjectBranches = false;
        },
        (error) => {
          this.toastrService.showError(error);
          this.loadingSelectedProjectBranches = false;
        }
      );
  }
}
