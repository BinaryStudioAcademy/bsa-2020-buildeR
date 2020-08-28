import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../../core/services/group.service';
import { takeUntil } from 'rxjs/operators';
import { Group } from '../../../shared/models/group/group';
import { BaseComponent } from '@core/components/base/base.component';
import { AuthenticationService } from '@core/services/authentication.service';
import { User } from '../../../shared/models/user/user';
import { UserRole } from '../../../shared/models/group/user-role';
import { ModalContentComponent } from '../../../core/components/modal-content/modal-content.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.sass']
})
export class GroupListComponent extends BaseComponent implements OnInit {
  userRole: typeof UserRole = UserRole;
  loadingGroups = false;
  groups: Group[];
  currentUser: User;
  constructor(private groupService: GroupService, private authService: AuthenticationService, private modalService: NgbModal) { super(); }

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
          this.groups = resp;
        }
      );
  }
  getCurrentUserRole(groupId: number) {
    const group = this.groups.find(g => g.id === groupId);
    const member = group.teamMembers.find(m => m.userId === this.currentUser.id);
    if (!member) {
      return null;
    }
    return member.memberRole;
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
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  // deleteGroup(groupId: number) {
  //   this.groupService.deleteGroup(groupId).subscribe(() => {
  //     this.groups = this.groups.filter(group => group.id !== groupId);
  //   });
  // }
}
