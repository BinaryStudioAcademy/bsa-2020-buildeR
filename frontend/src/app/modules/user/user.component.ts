import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabRoute } from '@shared/models/tabs/tab-route';
import { ModalCropperService } from '../../core/services/modal-cropper.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../shared/models/user/user';
import { UserAvatar } from '@shared/models/user/user-avatar';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass']
})
export class UserComponent implements OnInit {
  currentUser: User = {} as User;
  avatar: UserAvatar = {} as UserAvatar;
  githubClick = false;
  googleClick = false;

  tabRoutes: TabRoute[] = [
    { name: 'Profile', route: '' },
    { name: 'Project settings', route: '' },
    { name: 'Notification settings', route: 'notificationsettings' },
  ];

  constructor(
    private route: ActivatedRoute,
    private cropper: ModalCropperService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.currentUser = data.user);
    this.userService.userLogoUrl.subscribe(url => {
      this.currentUser.avatarUrl = url;
    });
    this.userService.userLogoUserName.subscribe(userName => {
      this.currentUser.username = userName;
    });
  }

  async open() {
    const file = await this.cropper.open();
    if (file) {
      const formData = new FormData();
      formData.append('file', file, file.name);
      console.log(file.name);
      this.userService.uploadAvatar(formData, this.currentUser.id).subscribe((res) => {
        console.log(res.avatarUrl);
        this.currentUser.avatarUrl = res.avatarUrl;
        this.userService.changeImageUrl(res.avatarUrl);
      });
    }
    else {
      console.log('Image didn`t change');
    }
  }
}
