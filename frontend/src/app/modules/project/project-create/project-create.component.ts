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
import { projectNameAsyncValidator } from '../validators/project-name.async-validator';

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
  credentialUsername = '';

  userHasCredentials = false;
  githubRepoSection = false;
  urlSection = false;

  isPrivateRepoChoosed = false;

  @ViewChild('repository', { static: false }) instance: NgbTypeahead;

  repositoryInputFocus$ = new Subject<string>();
  repositoryInputClick$ = new Subject<string>();
  repositoryInputSubmit$ = new Subject<string>();

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
          Validators.required,
          Validators.pattern(`^(?![-\\.])(?!.*--)(?!.*\\.\\.)[[A-Za-z0-9-\\._\s]+(?<![-\\.])$`)
        ],
        [
          projectNameAsyncValidator(this.projectService, this.user)
        ]),
      description: new FormControl(this.newProject.description,
        [
          Validators.maxLength(300),
          Validators.pattern('[^А-яа-я]*')
        ]),
      isPublic: new FormControl(this.newProject.isPublic, []),
    });

    this.syncService.checkIfUserHasCredentials(this.user.id)
      .subscribe(res => {
        this.userHasCredentials = res;
        if (res) {
          this.synchronize();
        }
      });
  }

  defaultValues() {
    this.newProject = {
      name: '',
      description: '',
      isPublic: true,
      ownerId: this.user.id,
      repository: {} as NewRepository
    };
  }

  save() {
    this.newProject.name = this.projectForm.controls['name'].value;
    this.newProject.description = this.projectForm.controls['description'].value;
    this.newProject.isPublic = this.projectForm.controls['isPublic'].value;
    this.newProject.repository = this.projectForm.controls['_repository']?.value ?? this.newProject.repository;
    this.newProject.repository.url = this.projectForm.controls['repositoryURL']?.value;

    this.newProject.ownerId = this.user.id;

    this.projectService.createProject(this.newProject).subscribe(
      (resp) => {
        this.toastrService.showSuccess('Project created!');
        this.activeModal.close("Saved");
        if (this.syncService.checkIfUserHasCredentials(this.user.id)) {
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

  synchronize() {
    this.syncService.getUserRepositories(this.user.id)
                .subscribe(repos => this.repositories = repos);

    this.syncService.getUsernameFromCredentials(this.user.id)
          .subscribe(res => this.credentialUsername = res.username);
  }

  cancel() {
    this.activeModal.dismiss("Canceled");
  }
  onToggle(change: boolean) {
    change = !change;
  }

  githubRadioClicked() {
    if (!this.userHasCredentials) {
      return;
    }

    this.githubRepoSection = true;
    this.urlSection = false;
    this.newProject.repository.createdByLink = false;

    if (this.projectForm.controls['repositoryURL']) {
      this.projectForm.removeControl('repositoryURL');
    }

    this.projectForm.addControl('_repository', new FormControl(this.newProject.repository,
      [
        Validators.required
      ]
    ),
    );
  }

  urlRadioClicked() {
    this.urlSection = true;
    this.githubRepoSection = false;
    this.newProject.repository.createdByLink = true;

    if (this.projectForm.controls['_repository']) {
      this.projectForm.removeControl('_repository');
    }

    this.projectForm.addControl('repositoryURL', new FormControl(this.newProject.repository.url,
      [
        Validators.required,
        Validators.pattern(`https:\/\/github\.com\/[A-Za-z0-9-]+\/[A-Za-z0-9_.-]+`)
      ],
      [
        repoUrlAsyncValidator(this.syncService, this.user),
      ]
    ),
    );
  }

  closeForm() {
    this.activeModal.close();
  }

  isFormValid() {
    if (!this.newProject.repository) {
      return false;
    }

    if (!this.newProject.repository.createdByLink) {
      return this.projectForm.controls['_repository']?.value.name && this.projectForm.valid && !this.projectForm.pending;
    }
    else {
      return this.projectForm.controls['repositoryURL']?.value && this.projectForm.valid && !this.projectForm.pending;
    }
  }

  handleRepositoryInputClick(repo: Repository) {
    this.projectForm.controls['name'].setValue(repo.name);
    this.projectForm.controls['description'].setValue(repo.description);
  }

  repoListResultFormatter = (repo: Repository) => repo.name;
}
