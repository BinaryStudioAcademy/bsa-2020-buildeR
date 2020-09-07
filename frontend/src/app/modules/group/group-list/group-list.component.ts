import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GroupService } from '../../../core/services/group.service';
import { takeUntil } from 'rxjs/operators';
import { Group } from '../../../shared/models/group/group';
import { BaseComponent } from '@core/components/base/base.component';
import { AuthenticationService } from '@core/services/authentication.service';
import { User } from '../../../shared/models/user/user';
import { GroupRole } from '../../../shared/models/group/group-role';
import { ModalContentComponent } from '../../../core/components/modal-content/modal-content.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { TeamMemberService } from '../../../core/services/team-member.service';
import { RemoveTeamMember } from '@shared/models/group/remove-team-member';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.sass']
})
export class GroupListComponent extends BaseComponent implements OnInit {
  groupRole: typeof GroupRole = GroupRole;
  loadingGroups = false;
  groups: Group[];
  groupInvites: Group[];
  currentUser: User;
  // @Output() groupsChanged = new EventEmitter<Group[]>();

  constructor(
    private groupService: GroupService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private toastrService: ToastrNotificationsService,
    private teamMemberService: TeamMemberService
  ) { super(); }

  ngOnInit(): void {
    this.loadingGroups = true;
    this.currentUser = this.authService.getCurrentUser();
    this.getGroups();
  }
  getGroups() {
    this.loadingGroups = true;
    this.groupService
      .getUserGroups(this.currentUser.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (resp) => {
          this.loadingGroups = false;
          this.groupInvites = resp.filter((g => g.teamMembers.filter(
            t => !t.isAccepted &&
              t.userId === this.currentUser.id &&
              t.memberRole !== GroupRole.Owner).length !== 0));
          this.groups = resp.filter((g => g.teamMembers.filter(t => t.isAccepted &&
            t.userId === this.currentUser.id).length !== 0));
          // this.onGroupsChanged(this.groups);

          const groupsOwnerIsNotAccepted = resp.filter((g => g.teamMembers.filter(
            t => !t.isAccepted &&
              t.userId === this.currentUser.id &&
              t.memberRole === GroupRole.Owner).length !== 0));
          if (groupsOwnerIsNotAccepted.length !== 0) {
            this.setAcceptedIfOwner(groupsOwnerIsNotAccepted);
            this.getGroups();
          }
        }
      );
  }

  // onGroupsChanged(groups: Group[]) {
  //   this.groupsChanged.emit(groups);
  // }

  getCurrentUserRole(groupId: number) {
    const group = this.groups.find(g => g.id === groupId);
    return this.getRole(group);
  }
  getCurrentUserRoleInvite(groupId: number) {
    const group = this.groupInvites.find(g => g.id === groupId);
    return this.getRole(group);
  }
  getRole(group: Group) {
    const member = group.teamMembers.find(m => m.userId === this.currentUser.id);
    if (!member) {
      return null;
    }

    return member.memberRole;
  }

  setAcceptedIfOwner(groups: Group[]) { // for already created groups
    for (const group of groups) {
      const currentMember = group.teamMembers.find(t => t.userId === this.currentUser.id &&
        t.memberRole === GroupRole.Owner && t.isAccepted === false);
      if (currentMember) {
        currentMember.isAccepted = true;
        this.teamMemberService
          .updateMember(currentMember)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe();
      }
    }
  }

  accept(group: Group) {
    const member = group.teamMembers.find(m => m.userId === this.currentUser.id);
    member.isAccepted = true;
    this.teamMemberService.updateMember(member).pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getGroups(); this.toastrService.showSuccess('You became a member of this group');
      },
        (err) => {
          this.toastrService.showError(err);
        });
  }
  decline(group: Group) {
    const member = group.teamMembers.find(m => m.userId === this.currentUser.id);
    const removeObject = {
      id: member.id,
      initiatorId: member.id,
      groupId: group.id
    } as RemoveTeamMember;
    this.teamMemberService.deleteMemberWithNotification(removeObject).pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getGroups();
      });
  }

  acceptedMembersCount(group: Group) {
    return group.teamMembers.filter(t => t.isAccepted === true).length;
  }

  deleteGroup(groupId: number) {
    const modalRef = this.modalService.open(ModalContentComponent);
    const data = {
      title: 'Group deletion',
      message: 'Are you sure you want to delete this group?',
      text:
        'All information associated to this group will be permanently deleted. This operation can not be undone.',
    };
    modalRef.componentInstance.content = data;
    modalRef.result
      .then((result) => {
        if (result) {
          this.groupService
            .deleteGroup(groupId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
              this.groups = this.groups.filter(
                (group) => group.id !== groupId
              );
              this.toastrService.showSuccess('Group is deleted');
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
