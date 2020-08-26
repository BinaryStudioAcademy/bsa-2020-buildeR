import { Component, OnInit } from '@angular/core';
import { SignalRService } from '@core/services/signal-r.service';
import { HttpService } from '@core/services/http.service';
import { environment } from '@env/../environments/environment';
import { AuthenticationService } from '@core/services/authentication.service';
import { Router } from '@angular/router';
import { User } from '@shared/models/user/user';
import { UserService } from '@core/services/user.service';
import { Group } from '../../../shared/models/group/group';
import { GroupService } from '../../../core/services/group.service';

@Component({
  selector: 'app-work-space',
  templateUrl: './work-space.component.html',
  styleUrls: ['./work-space.component.sass'],
})
export class WorkSpaceComponent implements OnInit {
  isShowNotifications = false;
  isMenuCollapsed = true;
  url = environment.signalRUrl + '/test';
  user: User;
  groups: Group[];
  constructor(
    private signalR: SignalRService,
    private httpService: HttpService,
    private authService: AuthenticationService,
    private router: Router,
    private userService: UserService,
    private groupService: GroupService
  ) {
  }

  ngOnInit(): void {
    this.signalR.signalRecieved.subscribe(() => {
      alert('You just received a test broadcast');
    });
    this.user = this.authService.getCurrentUser();
    this.userService.userLogoUrl.subscribe(url => {
      console.log(url);
      this.user.avatarUrl = url;
    });
    this.groupService.getAllGroups().subscribe(res => this.groups = res);
  }



  broadcast() {
    this.httpService
      .getFullRequest(this.url)
      .subscribe((res) => console.log(res));
  }
  logOut() {
    this.authService.logout();
  }

  showNotifications() {
    this.isShowNotifications = !this.isShowNotifications;
  }
}
