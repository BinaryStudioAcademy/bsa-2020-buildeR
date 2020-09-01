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
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseComponent } from '@core/components/base/base.component';

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.sass']
})
export class GroupMembersComponent extends BaseComponent implements OnInit {
  loadingUsers = false;
  groupId: number;
  model;
  members: TeamMember[];
  pendingMembers: TeamMember[];
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
    this.loadingUsers = true;
    this.getGroupMembers(this.groupId);
    this.getUsers();
    this.memberForm = new FormGroup({
      user: new FormControl(' ', [Validators.required]),
      dropdown: new FormControl(this.groupRole[GroupRole.Guest], [Validators.required])
    });
  }

  getGroupMembers(groupId: number) {
    this.loadingUsers = true;
    this.groupService.getMembersByGroup(groupId).pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.loadingUsers = false;
        this.members = res.body.filter((t => t.isAccepted));
        this.pendingMembers = res.body.filter((t => !t.isAccepted));
      });
  }
  getUsers() {
    this.loadingUsers = true;
    this.userService.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.loadingUsers = false;
      this.users = res.body.filter(
        (user) => !this.members.some(x => x.userId === user.id) && !this.pendingMembers.some(x => x.userId === user.id)
      );
    });
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
    console.log(this.newTeamMember.memberRole);
    if (!this.newTeamMember.memberRole) {
      this.newTeamMember.memberRole = GroupRole.Guest;
    }
    this.newTeamMember.isAccepted = false;
    this.teamMemberService.createMember(this.newTeamMember).pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getGroupMembers(this.groupId);
        this.getUsers();
        this.toastrService.showSuccess('Member was successfully added');
      },
        (err) => {
          this.toastrService.showError(err);
        });
  }

  deleteMember(memberId: number) {
    this.teamMemberService.deleteMember(memberId).pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.pendingMembers = this.pendingMembers.filter(
          (m) => m.id !== memberId
        );
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
