import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NewProject } from '@shared/models/project/new-project';
import { ProjectService } from '@core/services/project.service';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { User } from '../../../shared/models/user/user';
import { SynchronizationService } from '@core/services/synchronization.service';
import { Repository } from '@core/models/Repository';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, merge, from } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, take } from 'rxjs/operators';
import { FormGroup, FormControl, Validators, NgModel } from '@angular/forms';
import { NewRepository } from '@core/models/NewRepository';
import { repoUrlAsyncValidator } from '@core/validators/repo-url.async-validator';

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

  githubRepoSection = false;
  urlSection = false;

  isPrivateRepoChoosed = false;

  @ViewChild('repository', { static: false }) instance: NgbTypeahead;

  repositoryInputFocus$ = new Subject<string>();
  repositoryInputClick$ = new Subject<string>();

  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.repositoryInputClick$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.repositoryInputFocus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.repositories.slice(0, 5)
        : this.repositories.filter(r => r.name.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 5))
    );
  }

  constructor(
    private projectService: ProjectService,
    private toastrService: ToastrNotificationsService,
    private authService: AuthenticationService,
    private syncService: SynchronizationService,
    public activeModal: NgbActiveModal
  ) { }

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
      _repository: new FormControl(this.newProject._repository,
        [
          Validators.required
        ]
      ),
      repositoryURL: new FormControl(this.newProject._repository.url,
        [
          Validators.required,
          Validators.pattern(`https:\/\/github\.com\/[A-Za-z]+\/[A-Za-z]+`)
        ],
        [
          repoUrlAsyncValidator(this.syncService),
        ]
      ),
    });
    if (this.syncService.isGithubAccessable()) {
      this.syncService.getUserRepositories()
        .subscribe(repos => {
          this.repositories = repos;
        });
    }
  }

  defaultValues() {
    this.newProject = {
      name: '',
      description: '',
      isPublic: true,
      repository: '',
      ownerId: this.user.id,
      _repository: {} as NewRepository
    };
  }

  save() {
    this.newProject = this.projectForm.value as NewProject;
    this.newProject._repository.url = this.projectForm.value['repositoryURL'];
    this.newProject.ownerId = this.user.id;
    this.newProject.repository = this.newProject._repository.name;
    this.projectService.createProject(this.newProject).subscribe(
      (resp) => {
        this.toastrService.showSuccess('project created');
        this.activeModal.close("Saved");
        if (this.syncService.isGithubAccessable()) {
          this.syncService.registerWebhook(resp.id)
            .subscribe(() => resp.id);
        }
      },
      (error) => {
        this.toastrService.showError(error.message, error.name);
        this.activeModal.dismiss("Error on save");
      },
    );
  }
  cancel() {
    this.activeModal.dismiss("Canceled");
  }
  onToggle(change: boolean) {
    change = !change;
  }

  isGithubAccessable() {
    return localStorage.getItem('github-access-token');
  }

  githubRadioClicked() {
    if (!this.isGithubAccessable())
      return;

    this.githubRepoSection = true;
    this.urlSection = false;
    this.newProject._repository.createdByLink = false;
  }

  urlRadioClicked() {
    this.urlSection = true;
    this.githubRepoSection = false;
    this.newProject._repository.createdByLink = true;
  }

  closeForm() {
    this.activeModal.close();
  }

  isFormValid() {
    const repoControlValue = this.projectForm.value['_repository'];
    return ((repoControlValue.name && !repoControlValue.createdByLink) ||
           (this.projectForm.controls['repositoryURL'].valid && repoControlValue.createdByLink) ) &&
           this.projectForm.controls['name'].valid;
  }

  repoListResultFormatter = (repo: Repository) => repo.name;
}
