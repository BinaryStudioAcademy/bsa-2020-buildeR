import { Component, OnInit, ViewChild } from '@angular/core';
import { NewProject } from '@shared/models/project/new-project';
import { ProjectService } from '@core/services/project.service';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { User } from '../../../shared/models/user/user';
import { SynchronizationService } from '@core/services/synchronization.service';
import { Repository } from '@core/models/Repository';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, take } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.sass'],
})
export class ProjectCreateComponent implements OnInit {
  newProject: NewProject;
  user: User = this.authService.getCurrentUser();
  repositories: Repository[];
  projectForm: FormGroup;

  @ViewChild('repository', {static: true}) instance: NgbTypeahead;

  repositoryInputFocus$ = new Subject<string>();
  repositoryInputClick$ = new Subject<string>();

  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.repositoryInputClick$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.repositoryInputFocus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.repositories.map((r) => r.name).slice(0, 8)
        : this.repositories.map((r) => r.name).filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 8))
    );
  }

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private toastrService: ToastrNotificationsService,
    private authService: AuthenticationService,
    private syncService: SynchronizationService
  ) {}

  ngOnInit(): void {
    this.defaultValues();
    this.projectForm = new FormGroup({
      name: new FormControl(this.newProject.name,
        [
          Validators.minLength(4),
          Validators.maxLength(32),
          Validators.required
        ]),
      description: new FormControl(this.newProject.description, []),
      isPublic: new FormControl(this.newProject.isPublic, []),
      repositoryInput: new FormControl(this.newProject.repository,
        [
          Validators.required
        ]
      ),
    });
    this.syncService.getUserRepositories()
      .subscribe(repos => {
        this.repositories = repos;
        console.log(repos);
      });
  }
  defaultValues() {
    this.newProject = {
      name: '',
      description: '',
      isPublic: true,
      repository: '',
      ownerId: this.user.id,
    };
  }
  save() {
    this.newProject = this.projectForm.value as NewProject;
    this.newProject.ownerId = this.user.id;
    this.projectService.createProject(this.newProject).subscribe(
      (resp) => {
        this.toastrService.showSuccess('project created');
        this.router.navigate(['portal']);
        this.syncService.registerWebhook(resp.id)
          .subscribe(() => resp.id);
      },
      (error) => {
        this.toastrService.showError(error.message, error.name);
      }
    );
  }
  cancel() {
    this.router.navigate(['portal']);
  }
  onToggle(change: boolean) {
    change = !change;
  }
}
