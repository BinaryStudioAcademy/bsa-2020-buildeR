import { Component, OnInit, OnDestroy } from '@angular/core';
import { Project } from '@shared/models/project/project';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '@core/services/project.service';
import { CommandArgumentService } from '@core/services/command-argument.service';
import { BuildPluginService } from '@core/services/build-plugin.service';
import { BuildStepService } from '@core/services/build-step.service';
import { BaseComponent } from '@core/components/base/base.component';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap, delay } from 'rxjs/operators';
import { BuildStep } from '@shared/models/build-step';
import { EmptyBuildStep } from '@shared/models/empty-build-step';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommandArgument } from '@shared/models/command-argument';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentComponent } from '@core/components/modal-content/modal-content.component';

@Component({
  selector: 'app-project-build-steps',
  templateUrl: './project-build-steps.component.html',
  styleUrls: ['./project-build-steps.component.sass']
})
export class ProjectBuildStepsComponent extends BaseComponent implements OnInit, OnDestroy {
  projectId: number;
  project: Project = {} as Project;

  emptyBuildSteps: EmptyBuildStep[];

  allPostBuildSteps: BuildStep[] = new Array();
  postBuildSteps: BuildStep[];
  newPostBuildSteps: BuildStep[] = new Array();

  allBuildSteps: BuildStep[] = new Array();
  buildSteps: BuildStep[];
  newBuildSteps: BuildStep[] = new Array();

  isLoading = true;
  pluginGroups: string[];
  dockerfileUsed = false;

  constructor(
    private projectService: ProjectService,
    private buildStepService: BuildStepService,
    private commandArgumentService: CommandArgumentService,
    private buildPluginService: BuildPluginService,
    private toastrService: ToastrNotificationsService,
    private modalService: NgbModal,
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
          this.pluginGroups = Array.from(new Set(this.emptyBuildSteps.map(({pluginCommand}) => pluginCommand.plugin.pluginName)));
        },
        (error) => {
          this.isLoading = false;
          this.toastrService.showError(error);
        }
      );
  }

  addDockerfile() {
    const modalRef = this.modalService.open(ModalContentComponent);
    const data = {
      title: 'Use Dockerfile',
      message: 'If you choose this option your build steps will be deleted',
      text:
        'You can awlays switch back to manually configuring build steps for your project',
    };
    modalRef.componentInstance.content = data;
    modalRef.result.then((result) => {
      if (result) {
        this.isLoading = true;
        this.projectService.DeleteBuildStepsByProjectId(this.projectId)
        .pipe(takeUntil(this.unsubscribe$))
          .subscribe(
            (resp) => {
              this.buildSteps = [];
              this.allBuildSteps = [];
              this.postBuildSteps = [];
              this.allPostBuildSteps = [];
              const dockerfilePlugin = this.emptyBuildSteps.find(s => s.buildStepName === 'Dockerfile: Dockerfile');
              const newStep = {
                buildStepName: 'Dockerfile',
                pluginCommand: dockerfilePlugin.pluginCommand,
                projectId: this.projectId,
                pluginCommandId: dockerfilePlugin.pluginCommand.id,
                workDirectory: ''
              } as BuildStep;
              this.addEmptyCommand(newStep);
              this.isLoading = false;
              this.newBuildSteps.push(newStep);
              this.allBuildSteps.push(newStep);
              this.dockerfileUsed = true;
            },
            (error) => {
              this.isLoading = false;
              this.toastrService.showError(error);
            }
          );
      }
    });
  }

  deleteDockerFile() {
    const modalRef = this.modalService.open(ModalContentComponent);
    const data = {
      title: 'Switch to steps',
      message: 'If you choose this option your Dockerfile won\'t be used',
      text:
        'You always can switch back to using Dockerfile for building your project',
    };
    modalRef.componentInstance.content = data;
    modalRef.result.then((result) => {
      if (result) {
        const dockerStep = this.allBuildSteps[0];
        if (dockerStep) {
          this.removeBuildStep(dockerStep);
        }
        this.allBuildSteps = [];
        this.dockerfileUsed = false;
      }
    });
  }

  getProjectBuildSteps(projectId: number) {
    this.isLoading = true;
    this.buildStepService
      .getBuildStepsByProject(projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (resp) => {
          this.buildSteps = resp.body.filter(s => !s.buildStepName.startsWith('Post Actions'));
          this.postBuildSteps = resp.body.filter(s => s.buildStepName.startsWith('Post Actions'));
          this.postBuildSteps.forEach(step => {
            step.configObject = JSON.parse(step.config);
          });

          this.newPostBuildSteps = [];
          this.newBuildSteps = [];

          this.allBuildSteps = [];
          this.allPostBuildSteps = [];

          this.allPostBuildSteps = this.allPostBuildSteps.concat(this.postBuildSteps);
          this.allBuildSteps = this.allBuildSteps.concat(this.buildSteps);

          this.isLoading = false;
          if (this.allBuildSteps.length && this.allBuildSteps[0].buildStepName.startsWith('Dockerfile')) {
            this.dockerfileUsed = true;
          }
        },
        (error) => {
          this.isLoading = false;
          this.toastrService.showError(error);
        }
      );
  }

  addNewBuildStep(step: EmptyBuildStep) {
    const allStepsLength = this.allBuildSteps.length + this.allPostBuildSteps.length;
    const newStep = {
      pluginCommand: step.pluginCommand,
      buildStepName: step.buildStepName,
      pluginCommandId: step.pluginCommand.id,
      projectId: this.projectId,
      index: allStepsLength,
      commandArguments: [],
      config: step.config,
      isEditing: true
    } as BuildStep;
    if (!step.buildStepName.startsWith('Post Actions')) {
      this.addEmptyCommand(newStep);
      this.newBuildSteps.push(newStep);
      this.allBuildSteps.push(newStep);
    } else {
      newStep.configObject = JSON.parse(newStep.config);
      this.newPostBuildSteps.push(newStep);
      this.allPostBuildSteps.push(newStep);
    }
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

  searchFunctionFactory(step: BuildStep): (text: Observable<string>) => Observable<string[]> {
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
    if (this.newBuildSteps !== [] || this.newPostBuildSteps !== []) {
      let steps: BuildStep[] = [];
      steps = steps.concat(this.newBuildSteps, this.newPostBuildSteps);
      steps.forEach(step => {
        step.config = JSON.stringify(step.configObject);
        this.buildStepService
        .createBuildStep(step)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (resp) => {
            if (resp.buildStepName.startsWith('Post Actions')) {
              this.postBuildSteps.push(resp);
            }
            else {
              this.buildSteps.push(resp);
            }
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
    let steps: BuildStep[] = [];
    steps = steps.concat(this.buildSteps, this.postBuildSteps);
    steps.forEach(step => {
      step.config = JSON.stringify(step.configObject);
    });
    this.buildStepService.bulkUpdate(steps)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (resp) => {
        this.getProjectBuildSteps(this.projectId);
       },
      (error) => {
        this.isLoading = false;
        this.toastrService.showError(error);
      });
  }

  removeBuildStep(buildStep: BuildStep) {
    if (!buildStep.id) {
      this.newBuildSteps = this.newBuildSteps.filter(step => buildStep.index !== step.index);
      this.allBuildSteps = this.allBuildSteps.filter(step => buildStep.index !== step.index);
      this.newPostBuildSteps = this.newPostBuildSteps.filter(step => buildStep.index !== step.index);
      this.allPostBuildSteps = this.allPostBuildSteps.filter(step => buildStep.index !== step.index);
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
          this.postBuildSteps = this.postBuildSteps.filter(step => buildStep.id !== step.id);
          this.allPostBuildSteps = this.allPostBuildSteps.filter(step => buildStep.id !== step.id);
        },
        (error) => {
          this.isLoading = false;
          this.toastrService.showError(error);
        }
      );
    }
  }

  buildStepsDrop(event: CdkDragDrop<string[]>) {
    if (event.currentIndex !== event.previousIndex) {
      this.increaseIndexesOfBuildStepsFrom(event.currentIndex, event.previousIndex);
    }
  }

  increaseIndexesOfBuildStepsFrom(newIndex: number, oldIndex: number) {
    moveItemInArray(this.allBuildSteps, oldIndex, newIndex);
    this.allBuildSteps.forEach(element => {
      element.index = this.allBuildSteps.indexOf(element);
    });
  }

  postBuildStepsDrop(event: CdkDragDrop<string[]>) {
    if (event.currentIndex !== event.previousIndex) {
      this.increaseIndexesOfPostBuildStepsFrom(event.currentIndex, event.previousIndex);
    }
  }

  increaseIndexesOfPostBuildStepsFrom(newIndex: number, oldIndex: number) {
    moveItemInArray(this.allPostBuildSteps, oldIndex, newIndex);
    this.allPostBuildSteps.forEach(element => {
      element.index = this.allPostBuildSteps.indexOf(element);
    });
  }

  expandAll() {
    this.allBuildSteps.forEach(step => {
      step.isEditing = true;
    });
    this.allPostBuildSteps.forEach(step => {
      step.isEditing = true;
    });
  }

  collapseAll() {
    this.allBuildSteps.forEach(step => {
      step.isEditing = false;
    });
    this.allPostBuildSteps.forEach(step => {
      step.isEditing = true;
    });
  }

  trackByFn(index: number) {
    return index;
  }
}
