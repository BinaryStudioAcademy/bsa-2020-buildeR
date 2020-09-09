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
import { AuthenticationService } from '@core/services/authentication.service';
import { RemoveTeamMember } from '@shared/models/group/remove-team-member';

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
    GroupRole.Guest,
    GroupRole.Admin,
    GroupRole.Contributor,
    GroupRole.Builder
  ];
  currentUser: User;
  memberForm: FormGroup;
  isShowSpinner = false;

  constructor(
    private groupService: GroupService,
    private route: ActivatedRoute,
    private userService: UserService,
    private teamMemberService: TeamMemberService,
    private toastrService: ToastrNotificationsService,
    private authService: AuthenticationService,
  ) {
    super();
  }
  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.groupId = data.group.id;
    });
    this.loadingUsers = true;
    this.getGroupMembers(this.groupId);
    this.getUsers();
    this.currentUser = this.authService.getCurrentUser();
    this.memberForm = new FormGroup({
      user: new FormControl(' ', [Validators.required]),
      dropdown: new FormControl(this.groupRole[GroupRole.Guest], [Validators.required])
    });
  }

  getGroupMembers(groupId: number) {
    this.loadingUsers = true;
    this.groupService.getMembersByGroup(groupId).pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.members = res.body;
        this.pendingMembers = res.body.filter((t => !t.isAccepted));
        this.loadingUsers = false;
      });
  }
  getUsers() {
    this.loadingUsers = true;
    this.userService.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.loadingUsers = false;
      if (this.members) {
        this.users = res.body.filter(
          (user) => !this.members?.some(x => x.userId === user.id) && !this.pendingMembers.some(x => x.userId === user.id)
        );
      }
    });
  }
  changeMemberRole(member: TeamMember, newUserRole: GroupRole) {
    member.memberRole = newUserRole;
    member.initiatorId = this.currentUser.id;
    this.teamMemberService.updateMember(member).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.teamMemberService.teamMembersChanged.next();
      this.toastrService.showSuccess('Member role successfully changed');
    },
      (err) => {
        this.toastrService.showError(err);
      }
    );
  }
  onSubmit() {
    this.isShowSpinner = true;
    this.newTeamMember = this.memberForm.value as TeamMember;
    this.newTeamMember.groupId = this.groupId;
    this.newTeamMember.userId = this.memberForm.controls.user.value.id;
    this.newTeamMember.memberRole = this.memberForm.controls.dropdown.value;
    this.newTeamMember.initiatorId = this.currentUser.id;

    if (!this.newTeamMember.memberRole) {
      this.newTeamMember.memberRole = GroupRole.Guest;
    }
    this.newTeamMember.isAccepted = false;
    this.teamMemberService.createMember(this.newTeamMember).pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.teamMemberService.teamMembersChanged.next();
        this.getGroupMembers(this.groupId);
        this.isShowSpinner = false;
        this.getUsers();
        this.toastrService.showSuccess('Member was successfully invited');
      },
        (err) => {
          this.isShowSpinner = false;
          this.toastrService.showError(err);
        });
  }

  deleteMember(memberId: number) {
    const removeObject = {
      id: memberId,
      initiatorUserId: this.currentUser.id,
      groupId: this.groupId
    } as RemoveTeamMember;
    this.teamMemberService.deleteMemberWithNotification(removeObject).pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.teamMemberService.teamMembersChanged.next();
        this.getGroupMembers(this.groupId);
        this.getUsers();
        this.toastrService.showSuccess('Member was successfully deleted');
      });
  }

  isCurrentUserOwnerOrAdmin() {
    return this.members?.some(m => m.user.id === this.currentUser.id &&
      (m.memberRole === GroupRole.Owner || m.memberRole === GroupRole.Admin));
  }

  isCurrentUserAccepted() {
    return this.members?.some(m => m.user.id === this.currentUser.id && m.isAccepted);
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.users?.filter(v => v.username.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
          v.email.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
  formatter = (x: { username: string }) => x.username;
  inputFormatter = (x: { username: string }) => x.username;
}
