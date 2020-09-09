import { Component, OnInit, Input } from '@angular/core';
import { GroupService } from '../../../core/services/group.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewGroup } from '../../../shared/models/group/new-group';
import { Group } from '../../../shared/models/group/group';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';


@Component({
  selector: 'app-group-settings',
  templateUrl: './group-settings.component.html',
  styleUrls: ['./group-settings.component.sass']
})
export class GroupSettingsComponent implements OnInit {
  groupId: number;
  groupForm: FormGroup;
  @Input() group: Group = {} as Group;
  constructor(
    private groupService: GroupService,
    private toastrService: ToastrNotificationsService,
    public route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.groupId = data.group.id;
      this.group = data.group;
    });
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
    group.isPublic = group.isPublic.toString() === 'true';
    this.group = Object.assign(this.group, group);
    this.groupService.updateGroup(this.group).subscribe(() => {
      this.groupService.userGroupsChanged.next();
      this.groupService.changeGroupNameAndStatus(this.group.name, this.group.isPublic);
      this.toastrService.showSuccess('Group successfully updated');
    }, (err) => {
      this.toastrService.showError(err);
    });
  }
  reset() {
    this.groupForm.reset(this.group);
  }

}
