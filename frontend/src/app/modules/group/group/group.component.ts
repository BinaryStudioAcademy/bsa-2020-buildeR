import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@core/components/base/base.component';
import { AuthenticationService } from '@core/services/authentication.service';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { GroupRole } from '@shared/models/group/group-role';
import { TeamMember } from '@shared/models/group/team-member';
import { TabRoute } from '@shared/models/tabs/tab-route';
import { User } from '@shared/models/user/user';
import { takeUntil } from 'rxjs/operators';
import { GroupService } from '../../../core/services/group.service';
import { Group } from '../../../shared/models/group/group';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.sass']
})
export class GroupComponent extends BaseComponent implements OnInit {
  id: number;
  group: Group = {} as Group;
  isLoading = false;
  currentTeamMember: TeamMember = {} as TeamMember;
  currentUser: User = {} as User;

  tabRoutesPremium: TabRoute[] = [
    { name: 'Projects', route: 'projects' },
    { name: 'Chat', route: 'chat' },
    { name: 'Members', route: 'members' },
    { name: 'Settings', route: 'settings' },
  ];

  tabRoutesDefault: TabRoute[] = [
    { name: 'Projects', route: 'projects' },
    { name: 'Chat', route: 'chat' },
    { name: 'Members', route: 'members' }
  ];

  constructor(
    private groupService: GroupService,
    private toastrService: ToastrNotificationsService,
    private route: ActivatedRoute,
    private authService: AuthenticationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.group = data.group;
      this.id = this.group.id;
    });
    this.groupService.groupName.subscribe((res) => {
      this.group.name = res;
    });
    this.groupService.groupIsPublic.pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.group.isPublic = res;
    });
    this.currentUser = this.authService.getCurrentUser();
    this.getGroup(this.id);
  }
  getGroup(groupId: number) {
    this.isLoading = true;
    this.groupService.getGroupById(groupId).pipe(takeUntil(this.unsubscribe$)).subscribe(
      (data) => {
        this.isLoading = false;
        this.group = data;
        this.groupService.getMembersByGroup(this.group.id)
          .subscribe((resp) => this.currentTeamMember = resp.body.find(t => t.userId === this.currentUser.id));
      },
      (error) => {
        this.isLoading = false;
        this.toastrService.showError(error.message, error.name);
      }
    );
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
