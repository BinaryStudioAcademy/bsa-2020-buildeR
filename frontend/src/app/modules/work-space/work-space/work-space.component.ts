import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@core/components/base/base.component';
import { AuthenticationService } from '@core/services/authentication.service';
import { HttpService } from '@core/services/http.service';
import { UserService } from '@core/services/user.service';
import { User } from '@shared/models/user/user';
import { takeUntil } from 'rxjs/operators';
import { GroupService } from '../../../core/services/group.service';
import { Group } from '../../../shared/models/group/group';

@Component({
  selector: 'app-work-space',
  templateUrl: './work-space.component.html',
  styleUrls: ['./work-space.component.sass'],
})
export class WorkSpaceComponent extends BaseComponent implements OnInit {
  isShowNotifications = false;
  isMenuCollapsed = true;
  user: User;
  groups: Group[];
  groupsLoaded: Promise<boolean>;
  countNotifications = 0;
  constructor(
    private httpService: HttpService,
    private authService: AuthenticationService,
    private userService: UserService,
    private groupService: GroupService
  ) {
    super();
  }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.userService.userLogoUrl.subscribe(url => {
      console.log(url);
      this.user.avatarUrl = url;
    });
    this.getGroups();
  }

  public getGroups() {
    this.groupService.getUserGroups(this.user.id).pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => { this.groups = res; this.groupsLoaded = Promise.resolve(true); });
  }
  logOut() {
    this.authService.logout();
  }

  showNotifications() {
    this.isShowNotifications = !this.isShowNotifications;
  }

  counterNotifications(count: number) {
    this.countNotifications += count;
  }

  showHideDropdownMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  collapse() {
    this.isMenuCollapsed = true;
  }
}
