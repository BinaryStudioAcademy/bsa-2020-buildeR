import { Component, OnInit, OnDestroy } from '@angular/core';
import { Project } from '@shared/models/project/project';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '@core/services/project.service';
import { BuildStepService } from '@core/services/build-step.service';
import { BaseComponent } from '@core/components/base/base.component';
import { takeUntil } from 'rxjs/operators';
import { BuildStep } from '@shared/models/build-step';
import { EmptyBuildStep } from '@shared/models/empty-build-step';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-project-build-steps',
  templateUrl: './project-build-steps.component.html',
  styleUrls: ['./project-build-steps.component.sass']
})
export class ProjectBuildStepsComponent extends BaseComponent implements OnInit, OnDestroy {
  projectId: number;
  project: Project = {} as Project;
  buildSteps: BuildStep[];
  emptyBuildSteps: EmptyBuildStep[];
  isLoading = true;
  isAdding = false;
  newBuildStep: EmptyBuildStep = {} as EmptyBuildStep;
  workDir: string;

  constructor(
    private projectService: ProjectService,
    private buildStepService: BuildStepService,
    private toastrService: ToastrNotificationsService,
    private route: ActivatedRoute
  ) {
    super();
    route.parent.params.subscribe((params) => this.projectId = params.projectId);
  }


  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  ngOnInit(): void {
    this.project = this.route.snapshot.data.project as Project;
    this.getProject(this.projectId);
    this.getProjectBuildSteps(this.projectId);
    this.getEmptyBuildSteps();
    this.isLoading = false;
  }

  getProject(projectId: number) {
    this.isLoading = true;
    this.projectService
      .getProjectById(projectId)
      .subscribe(
        (data) => {
          this.project = data;
        },
        (error) => {
          this.toastrService.showError(error.message, error.name);
        }
      );
  }

  getEmptyBuildSteps() {
    this.isLoading = true;
    this.buildStepService
      .getEmptyBuildSteps()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (resp) => {
          this.emptyBuildSteps = resp.body;
        },
        (error) => {
          this.toastrService.showError(error);
        }
      );
  }

  getProjectBuildSteps(projectId: number) {
    this.isLoading = true;
    this.buildStepService
      .getBuildStepsByProject(projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (resp) => {
          this.buildSteps = resp.body;
        },
        (error) => {
          this.toastrService.showError(error);
        }
      );
  }

  addBuildStep() {
    this.isAdding = true;
    this.newBuildStep = this.emptyBuildSteps[0];
  }

  cancelBuildStep() {
    this.newBuildStep = null;
    this.isAdding = false;
    this.workDir = null;
  }

  saveBuildStep() {
    const buildStep = {} as BuildStep;

    buildStep.pluginCommand = this.newBuildStep.pluginCommand;
    buildStep.index = this.buildSteps.length;
    buildStep.buildStepName = this.newBuildStep.buildStepName;
    buildStep.pluginCommandId = this.newBuildStep.pluginCommand.id;
    buildStep.projectId = this.projectId;
    buildStep.workDirectory = this.workDir;

    this.cancelBuildStep();

    this.isLoading = true;
    this.buildStepService
      .createBuildStep(buildStep)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (resp) => {
          this.buildSteps.push(resp);
        },
        (error) => {
          this.toastrService.showError(error);
        }
      );

    this.isLoading = false;
  }

  removeBuildStep(buildStep: BuildStep) {
    this.isLoading = true;
    this.buildStepService
      .removeBuildStep(buildStep)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        () => {
          this.buildSteps = this.buildSteps.filter(step => buildStep.id !== step.id);
        },
        (error) => {
          this.toastrService.showError(error);
        }
      );

    this.isLoading = false;
  }

  drop(event: CdkDragDrop<string[]>) {
    this.increaseIndexesOfBuildStepsFrom(this.projectId, event.currentIndex, event.previousIndex);
  }

  increaseIndexesOfBuildStepsFrom(projectId: number, newIndex: number, oldIndex: number) {
    this.isLoading = true;
    this.buildStepService
      .udpateIndexesOfBuildSteps(projectId, newIndex, oldIndex)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        () => {
          moveItemInArray(this.buildSteps, oldIndex, newIndex);
        },
        (error) => {
          this.toastrService.showError(error);
        }
      );

    this.isLoading = false;
  }
}
