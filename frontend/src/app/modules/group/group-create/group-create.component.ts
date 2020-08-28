import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GroupService } from '@core/services/group.service';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { NewGroup } from '../../../shared/models/group/new-group';
import { AuthenticationService } from '@core/services/authentication.service';

@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.sass']
})
export class GroupCreateComponent implements OnInit {

  groupForm: FormGroup;
  newGroup: NewGroup = {} as NewGroup;

  constructor(
    private groupService: GroupService,
    private toastrService: ToastrNotificationsService,
    public router: Router,
    private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.groupForm = new FormGroup({
      name: new FormControl('',
        [
          Validators.minLength(4),
          Validators.maxLength(32),
          Validators.required,
          Validators.pattern(`^(?![-\\.])(?!.*--)(?!.*\\.\\.)[[A-Za-z0-9-\\._ ]+(?<![-\\.])$`)
        ]),
      description: new FormControl('',
        [
          Validators.maxLength(32),
          Validators.pattern('[^А-яа-я]*')
        ]),
      isPublic: new FormControl('false', Validators.required)
    });

  }

  onSubmit() {
    this.newGroup = this.groupForm.value as NewGroup;
    this.newGroup.isPublic = (this.groupForm.value[`isPublic`] === 'true');
    this.newGroup.creatorId = this.authService.getCurrentUser().id;
    this.groupService.createGroup(this.newGroup).subscribe((resp) => {
      this.toastrService.showSuccess('Group is created');
      this.router.navigate(['/portal/groups']);
    },
      (error) => {
        this.toastrService.showError(error.message, error.name);
        this.router.navigate(['/portal/groups']);
      });
  }
}
