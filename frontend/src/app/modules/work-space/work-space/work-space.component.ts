import { Component, OnInit } from '@angular/core';
import { SignalRService } from '@core/services/signal-r.service';
import { HttpService } from '@core/services/http.service';
import { environment } from '@env/../environments/environment';
import { AuthenticationService } from '@core/services/authentication.service';
import { Router } from '@angular/router';
import { User } from '@shared/models/user/user';
import { ImgageHeaderService } from '@core/services/imgage-header-service.service';

@Component({
  selector: 'app-work-space',
  templateUrl: './work-space.component.html',
  styleUrls: ['./work-space.component.sass'],
})
export class WorkSpaceComponent implements OnInit {
  isShowNotifications = false;
  isMenuCollapsed = true;
  url = environment.signalRUrl + '/test';
  user: User = {} as User;
  constructor(
    private signalR: SignalRService,
    private httpService: HttpService,
    private authService: AuthenticationService,
    private router: Router,
    private changeImageService: ImgageHeaderService
  ) {}

  ngOnInit(): void {
    this.signalR.signalRecieved.subscribe(() => {
      alert('You just received a test broadcast');
    });
    this.user = this.authService.getUser();
    this.changeImageService.url.subscribe(url => {
      console.log(url);
      this.user.avatarUrl = url;
    });
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
    if (this.isShowNotifications) {
      this.isShowNotifications = false;
    } else {
      this.isShowNotifications = true;
    }
  }
}
