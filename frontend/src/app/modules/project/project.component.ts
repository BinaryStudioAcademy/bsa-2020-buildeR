import { Project } from 'src/app/shared/models/project/project';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { ProjectService } from '@core/services/project.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { TabRoute } from '@shared/models/tabs/tab-route';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SynchronizationService } from '@core/services/synchronization.service';
import { Branch } from '@core/models/Branch';
import { BaseComponent } from '@core/components/base/base.component';
import { NewBuildHistory } from '@shared/models/new-build-history';
import { AuthenticationService } from '@core/services/authentication.service';
import { User } from '@shared/models/user/user';
import {BuildHistory} from "@shared/models/build-history";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.sass'],
})
export class ProjectComponent extends BaseComponent implements OnInit{
  project: Project = {} as Project;
  isLoading: boolean;
  currentUser: User;

  loadingSelectedProjectBranches: boolean;
  selectedProjectBranches: Branch[];
  selectedProjectBranch: string;
  lastBuild: BuildHistory;

  tabRoutes: TabRoute[] = [
    { name: 'Current', route: 'current' },
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
    this.projectService.projectName.subscribe((res) => this.project.name = res);
    this.route.data.subscribe(({ project }) =>
    {
      this.project = project;
      this.lastBuild = this.project.buildHistories.reverse()[0];
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

  triggerBuild() {
    const newBuildHistory = {
      branchHash: this.selectedProjectBranch,
      performerId: this.currentUser.id,
      projectId: this.project.id
    } as NewBuildHistory;

    this.closeModal();
    const msg = `You’ve successfully triggered a build for ${newBuildHistory.branchHash} branch of ${this.project.name}. Hold tight, it might take a moment to show up.`;
    this.projectService
      .startProjectBuild(newBuildHistory)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        () => this.toastrService.showSuccess(msg),
        (res) => this.toastrService.showError(res.error)
      );
  }

  openBranchSelectionModal(content: TemplateRef<HTMLElement>, projectId: number) {
    this.loadProjectBranches(projectId);
    this.modalService
      .open(content)
      .result
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
        (resp) => this.selectedProjectBranches = resp,
        (resp) => this.toastrService.showError(resp.error),
        () => this.loadingSelectedProjectBranches = false
      );
  }
}
