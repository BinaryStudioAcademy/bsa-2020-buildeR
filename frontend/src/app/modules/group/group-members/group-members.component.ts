import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../../core/services/group.service';
import { ActivatedRoute } from '@angular/router';
import { TeamMember } from '../../../shared/models/group/team-member';
import { GroupRole } from '../../../shared/models/group/group-role';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { User } from '../../../shared/models/user/user';
import { UserService } from '../../../core/services/user.service';
import { TeamMemberService } from '../../../core/services/team-member.service';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { FormGroup, FormControl } from '@angular/forms';
import { BaseComponent } from '@core/components/base/base.component';

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.sass']
})
export class GroupMembersComponent extends BaseComponent implements OnInit {
  groupId: number;
  model;
  members: TeamMember[];
  newTeamMember: TeamMember;
  users: User[];
  groupRole: typeof GroupRole = GroupRole;
  roles = [
    GroupRole.Owner,
    GroupRole.Contributor,
    GroupRole.Builder,
    GroupRole.Guest
  ];
  memberForm: FormGroup;
  constructor(
    private groupService: GroupService,
    private route: ActivatedRoute,
    private userService: UserService,
    private teamMemberService: TeamMemberService,
    private toastrService: ToastrNotificationsService,
  ) {
    super();
    route.parent.params.subscribe(
      (params) => this.groupId = params.groupId);
  }
  ngOnInit(): void {
    this.getGroupMembers(this.groupId);
    this.getUsers();
    this.memberForm = new FormGroup({
      user: new FormControl(),
      dropdown: new FormControl(this.groupRole[GroupRole.Guest])
    });
  }

  getGroupMembers(groupId: number) {
    this.groupService.getMembersByGroup(groupId).pipe(takeUntil(this.unsubscribe$))
    .subscribe(res => this.members = res.body);
  }
  getUsers() {
    this.userService.getUsers().pipe(takeUntil(this.unsubscribe$))
    .subscribe(res => this.users = res.body);
  }
  changeMemberRole(member: TeamMember, newUserRole: GroupRole) {
    member.memberRole = newUserRole;
    this.teamMemberService.updateMember(member).pipe(takeUntil(this.unsubscribe$)).subscribe(() =>
      this.toastrService.showSuccess('Member role successfully changed'),
      (err) => {
        this.toastrService.showError(err);
      }
    );
  }
  onSubmit() {
    this.newTeamMember = this.memberForm.value as TeamMember;
    this.newTeamMember.groupId = this.groupId;
    this.newTeamMember.userId = this.memberForm.controls.user.value.id;
    this.newTeamMember.memberRole = this.memberForm.controls.dropdown.value;
    this.teamMemberService.createMember(this.newTeamMember).pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getGroupMembers(this.groupId);
        this.toastrService.showSuccess('Member was successfully added');
      },
        (err) => {
          this.toastrService.showError(err);
        });
  }
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.users.filter(v => v.username.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
          v.email.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
  formatter = (x: { username: string }) => x.username;
  inputFormatter = (x: { username: string }) => x.username;
}
