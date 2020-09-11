import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@core/components/base/base.component';
import { AuthenticationService } from '@core/services/authentication.service';
import { TabRoute } from '@shared/models/tabs/tab-route';
import { ModalCropperService } from '../../core/services/modal-cropper.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../shared/models/user/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass']
})
export class UserComponent extends BaseComponent implements OnInit {
  currentUser: User = {} as User;
  githubClick = false;
  googleClick = false;
  isOwner = false;

  tabRoutesOwner: TabRoute[] = [
    { name: 'Profile', route: './' },
    { name: 'History', route: 'history' },
    { name: 'Insights', route: 'insights' },
    { name: 'Notification settings', route: 'notificationsettings' },
    { name: 'Credential settings', route: 'credentialsettings' }
  ];

  tabRoutesGuest: TabRoute[] = [
    { name: 'Profile', route: './' },
    { name: 'History', route: 'history' },
    { name: 'Insights', route: 'insights' }
  ];

  constructor(
    private route: ActivatedRoute,
    private cropper: ModalCropperService,
    private userService: UserService,
    private authService: AuthenticationService) {
      super();
    }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.currentUser = data.user;
      if (this.currentUser.id === this.authService.getCurrentUser().id) {
        this.isOwner = true;
      }
    });
    this.userService.userLogoUrl.pipe(takeUntil(this.unsubscribe$)).subscribe(url => {
      this.currentUser.avatarUrl = url;
    });
    this.userService.userLogoUserName.pipe(takeUntil(this.unsubscribe$)).subscribe(userName => {
      this.currentUser.username = userName;
    });
  }

  async open() {
    if (!this.isOwner) {
      window.open(this.currentUser.avatarUrl);
      return;
    }
    const file = await this.cropper.open();
    if (file) {
      const formData = new FormData();
      formData.append('file', file, file.name);
      this.userService.uploadAvatar(formData, this.currentUser.id).subscribe((res) => {
        this.currentUser.avatarUrl = res.avatarUrl;
        this.userService.changeImageUrl(res.avatarUrl);
      });
    }
  }
}
