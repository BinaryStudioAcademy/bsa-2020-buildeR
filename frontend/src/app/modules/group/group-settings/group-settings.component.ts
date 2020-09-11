import { Component, OnInit, Input } from '@angular/core';
import { GroupService } from '../../../core/services/group.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Group } from '../../../shared/models/group/group';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { GroupRole } from '@shared/models/group/group-role';
import { TeamMember } from '@shared/models/group/team-member';
import { User } from '@shared/models/user/user';
import { AuthenticationService } from '@core/services/authentication.service';


@Component({
  selector: 'app-group-settings',
  templateUrl: './group-settings.component.html',
  styleUrls: ['./group-settings.component.sass']
})
export class GroupSettingsComponent implements OnInit {
  groupId: number;
  groupForm: FormGroup;
  isShowSpinner = false;
  currentTeamMember: TeamMember = {} as TeamMember;
  currentUser: User = {} as User;

  @Input() group: Group = {} as Group;

  constructor(
    private groupService: GroupService,
    private toastrService: ToastrNotificationsService,
    public route: ActivatedRoute,
    public authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.route.parent.data.subscribe(data => {
      this.groupId = data.group.id;
      this.group = data.group;
    });
    this.currentUser = this.authService.getCurrentUser();
    this.groupService.getMembersByGroup(this.group.id)
      .subscribe((resp) => this.currentTeamMember = resp.body.find(t => t.userId === this.currentUser.id));
    this.groupForm = new FormGroup({
      name: new FormControl(this.group.name,
        [
          Validators.minLength(4),
          Validators.maxLength(32),
          Validators.required,
          Validators.pattern(`^(?![-\\.])(?!.*--)(?!.*\\.\\.)[[A-Za-z0-9-\\._ ]+(?<![-\\.])$`)
        ]),
      description: new FormControl(this.group.description,
        [
          Validators.maxLength(32),
          Validators.pattern('[^А-яа-я]*')
        ]),
      isPublic: new FormControl(`${this.group.isPublic}`, Validators.required)
    });
  }

  onSubmit(group: Group) {
    this.isShowSpinner = true;
    group.isPublic = group.isPublic.toString() === 'true';
    this.group = Object.assign(this.group, group);
    this.groupService.updateGroup(this.group).subscribe(response => {
      this.groupService.emitGroupChanges(response);
      this.isShowSpinner = false;
      this.toastrService.showSuccess('Group successfully updated');
    }, (err) => {
      this.isShowSpinner = false;
      this.toastrService.showError('Group wasn\'t updated');
      this.toastrService.showError(err.error, err.name);
    });
  }
  reset() {
    this.groupForm.reset(this.group);
    this.groupForm.controls.isPublic.setValue(this.group.isPublic.toString());
  }

  canChangeSettings() {
    let check = false;
    if (this.currentTeamMember !== undefined &&
      this.currentTeamMember.isAccepted &&
      (this.currentTeamMember.memberRole === GroupRole.Owner ||
        this.currentTeamMember.memberRole === GroupRole.Admin)) {
      check = true;
    }
    return check;
  }

}
