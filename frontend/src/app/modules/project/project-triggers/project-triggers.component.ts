import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NewProjectTrigger} from '@shared/models/project/project-trigger/new-project-trigger';
import { UpdateTriggerCron } from '@shared/models/project/project-trigger/update-trigger-cron';
import { ProjectTrigger } from '@shared/models/project/project-trigger/project-trigger';
import { ProjectTriggerInfo } from '@shared/models/project/project-trigger/project-trigger-info';
import { TriggerService } from '@core/services/trigger.service';
import { SynchronizationService } from '@core/services/synchronization.service';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { ActivatedRoute } from '@angular/router';
import { Branch } from '@core/models/Branch';
import { ProjectService } from '@core/services/project.service';
import { Project } from '@shared/models/project/project';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, take } from 'rxjs/operators';

@Component({
  selector: 'app-project-triggers',
  templateUrl: './project-triggers.component.html',
  styleUrls: ['./project-triggers.component.sass']
})
export class ProjectTriggersComponent implements OnInit {
  project: Project;
  branches: Branch[];
  selectedBranch: string;
  runOnShedule = true;
  triggers: ProjectTriggerInfo[] = [];

  @ViewChild('branch', {static: false}) branchInput: NgbTypeahead;

  branchInputFocus$ = new Subject<string>();
  branchInputClick$ = new Subject<string>();

  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.branchInputClick$.pipe(filter(() => !this.branchInput.isPopupOpen()));
    const inputFocus$ = this.branchInputFocus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.branches.map((r) => r.name).slice(0, 8)
        : this.branches.map((r) => r.name).filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 8))
    );
  }

  constructor(
    private triggerService: TriggerService,
    private toastrService: ToastrNotificationsService,
    private route: ActivatedRoute,
    private projectSerivce: ProjectService,
    private syncService: SynchronizationService
    )
    { }

  ngOnInit(): void {
    this.projectSerivce.getProjectById(this.route.parent.snapshot.params.projectId)
            .subscribe(project => {
              this.project = project;
              this.syncService.getRepositoryBranches(project.repository)
                .subscribe(branches => this.branches = branches);
            });
    console.log(this.branchInput);
  }

  getTriggers() {
    this.triggerService.getTriggersByProjectId(this.project.id).subscribe(
      (data) => this.triggers = data,
      (error) => this.toastrService.showError(error.message, error.name)
    );
  }

  createTrigger(cron: string)  {
    if (this.selectedBranch) {

     const newTrigger: NewProjectTrigger = {
       projectId: this.project.id,
       branchHash: this.selectedBranch,
       cronExpression: cron
      };
     console.log(newTrigger.cronExpression);
     this.triggerService.createTrigger(newTrigger).subscribe(
        (data) => {
          console.log(data);

          this.triggers.push(data);
          this.toastrService.showSuccess('trigger created');
        },
        (error) => this.toastrService.showError(error.message, error.name)
      );
    }
  }
  updateTrigger(upTrigger: UpdateTriggerCron) {

    const findTrigger = this.triggers.find(t => t.id === upTrigger.id);

    const trigger: ProjectTrigger = {
      id: findTrigger.id,
      projectId: findTrigger.projectId,
      branchHash: findTrigger.branchHash,
      cronExpression: upTrigger.cronExpression
    };

    const index = this.triggers.findIndex(t => t.id === upTrigger.id);
    this.triggerService.updateTrigger(trigger).subscribe(
      (data) => {
        this.triggers.splice(index, 1, data);
        this.toastrService.showSuccess('trigger updated');
      },
      (error) => this.toastrService.showError(error.message, error.name)
    );

  }
  deleteTrigger(id: number) {

    this.triggerService.deleteTrigger(id).subscribe(
      (data) => {
        this.triggers = this.triggers.filter(x => x.id !== id);
        this.toastrService.showSuccess('trigger deleted');
      },
      (error) => this.toastrService.showError(error.message, error.name)
    );
  }
  onToggle(change: boolean) {
    change = !change;
  }
  compareToMinDate(date: Date){
    const minDate: Date = new Date('2000-01-01');
    const thisDate: Date = new Date(date);
    if (minDate < thisDate) {
      return true;
    }
    return false;
  }
}
