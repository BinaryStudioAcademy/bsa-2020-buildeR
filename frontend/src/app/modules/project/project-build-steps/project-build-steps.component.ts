import { Component, OnInit, OnDestroy } from '@angular/core';
import { Project } from '@shared/models/project/project';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '@core/services/project.service';
import { CommandArgumentService } from '@core/services/command-argument.service';
import { BuildPluginService } from '@core/services/build-plugin.service';
import { BuildStepService } from '@core/services/build-step.service';
import { BaseComponent } from '@core/components/base/base.component';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { BuildStep } from '@shared/models/build-step';
import { EmptyBuildStep } from '@shared/models/empty-build-step';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommandArgument } from '@shared/models/command-argument';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-project-build-steps',
  templateUrl: './project-build-steps.component.html',
  styleUrls: ['./project-build-steps.component.sass']
})
export class ProjectBuildStepsComponent extends BaseComponent implements OnInit, OnDestroy {
  projectId: number;
  project: Project = {} as Project;

  allBuildSteps: BuildStep[] = new Array();
  buildSteps: BuildStep[];
  emptyBuildSteps: EmptyBuildStep[];
  newBuildSteps: BuildStep[] = new Array();

  isLoading = true;

  constructor(
    private projectService: ProjectService,
    private buildStepService: BuildStepService,
    private commandArgumentService: CommandArgumentService,
    private buildPluginService: BuildPluginService,
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
    this.isLoading = true;
    this.project = this.route.snapshot.data.project as Project;
    this.getProject(this.projectId);
    this.getProjectBuildSteps(this.projectId);
    this.getEmptyBuildSteps();
  }

  getProject(projectId: number) {
    this.isLoading = true;
    this.projectService
      .getProjectById(projectId)
      .subscribe(
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

  getEmptyBuildSteps() {
    this.isLoading = true;
    this.buildStepService
      .getEmptyBuildSteps()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (resp) => {
          this.isLoading = false;
          this.emptyBuildSteps = resp.body;
        },
        (error) => {
          this.isLoading = false;
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
          this.newBuildSteps = [];
          this.allBuildSteps = [];
          this.allBuildSteps = this.allBuildSteps.concat(this.buildSteps);
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.toastrService.showError(error);
        }
      );
  }

  addNewBuildStep(step: EmptyBuildStep) {
    const newStep = {
      pluginCommand: step.pluginCommand,
      buildStepName: step.buildStepName,
      pluginCommandId: step.pluginCommand.id,
      projectId: this.projectId,
      index: this.allBuildSteps.length,
      commandArguments: [],
      isEditing: true
    } as BuildStep;
    this.addEmptyCommand(newStep);
    this.newBuildSteps.push(newStep);
    this.allBuildSteps.push(newStep);
  }

  editBuildStep(step: BuildStep) {
    step.isEditing = !step.isEditing;
  }

  addCommandArgument(step: BuildStep) {
    step.newCommandArgumentKey = '';
    step.newCommandArgumentValue = '';
  }

  saveCommandArgument(step: BuildStep) {
    const newCommandArgument = {
      buildStepId: step.id,
      key: step.newCommandArgumentKey,
      value: step.newCommandArgumentValue
    } as CommandArgument;
    step.commandArguments.push(newCommandArgument);
    this.clearNewCommandArgument(step);
  }


  clearNewCommandArgument(step: BuildStep) {
    step.newCommandArgumentKey = undefined;
    step.newCommandArgumentValue = undefined;
  }

  removeExistingCommandArgument(step: BuildStep, argumentId: number, key: string) {
    step.commandArguments = step.commandArguments.filter(commandArgument => commandArgument.key !== key);
    if (argumentId) {
      this.isLoading = true;
      this.commandArgumentService
        .removeCommandArgument(argumentId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          () => {
            this.isLoading = false;
            step.commandArguments = step.commandArguments.filter(commandArgument => commandArgument.id !== argumentId);
          },
          (error) => {
            this.isLoading = false;
            this.toastrService.showError(error);
          }
        );
    }
  }

  editCommandArgument(arg: CommandArgument) {
    this.isLoading = true;
    this.commandArgumentService.updateCommandArgument(arg)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (resp) => {
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.toastrService.showError(error);
        });
  }

  public searchFunctionFactory(step: BuildStep): (text: Observable<string>) => Observable<string[]> {
    const search = (text$: Observable<string>) => {
      return text$.pipe(
          debounceTime(200),
          distinctUntilChanged(),
          switchMap(term => term.length < 2
            ? [] : this.buildPluginService.versionsLookup(step.pluginCommand.plugin.dockerRegistryName, term))
      );
    };
    return search;
}

  saveNewBuildSteps() {
    if (this.newBuildSteps !== []) {
      this.newBuildSteps.forEach(step => {
        this.buildStepService
        .createBuildStep(step)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (resp) => {
            this.buildSteps.push(resp);
          },
          (error) => {
            this.isLoading = false;
            this.toastrService.showError(error);
          }
        );
      });
    }

  }

  addEmptyCommand(step: BuildStep) {
    if (step.buildStepName === 'Custom command: ') {
      const newCommandArgument = {
        key: ''
      } as CommandArgument;
      step.commandArguments.push(newCommandArgument);
    }
  }


  updateAllSteps() {
    this.isLoading = true;
    this.buildStepService.bulkUpdate(this.buildSteps)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (resp) => {
        this.getProjectBuildSteps(this.projectId);
       },
      (error) => {
        this.isLoading = false;
        this.toastrService.showError(error);
      });
    // this.buildSteps.forEach(step =>
    //   this.buildStepService.updateBuildStep(step)
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe(
    //     (resp) => {
    //       this.getProjectBuildSteps(this.projectId);
    //     },
    //     (error) => {
    //       this.isLoading = false;
    //       this.toastrService.showError(error);
    //     }));

  }

  removeBuildStep(buildStep: BuildStep) {
    if (!buildStep.id) {
      this.newBuildSteps = this.newBuildSteps.filter(step => buildStep.index !== step.index);
      this.allBuildSteps = this.allBuildSteps.filter(step => buildStep.index !== step.index);
    }
    else {
    this.isLoading = true;
    this.buildStepService
      .removeBuildStep(buildStep)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        () => {
          this.isLoading = false;
          this.buildSteps = this.buildSteps.filter(step => buildStep.id !== step.id);
          this.allBuildSteps = this.allBuildSteps.filter(step => buildStep.id !== step.id);
        },
        (error) => {
          this.isLoading = false;
          this.toastrService.showError(error);
        }
      );
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.currentIndex !== event.previousIndex) {
      this.increaseIndexesOfBuildStepsFrom(this.projectId, event.currentIndex, event.previousIndex);
    }
  }

  increaseIndexesOfBuildStepsFrom(projectId: number, newIndex: number, oldIndex: number) {
    moveItemInArray(this.allBuildSteps, oldIndex, newIndex);
    this.allBuildSteps.forEach(element => {
      element.index = this.allBuildSteps.indexOf(element);
    });
  }

  expandAll() {
    this.allBuildSteps.forEach(step => {
      step.isEditing = true;
    });
  }

  collapseAll() {
    this.allBuildSteps.forEach(step => {
      step.isEditing = false;
    });
  }
}
