import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabRoute } from '@shared/models/tabs/tab-route';
import { ModalCropperService } from '../../core/services/modal-cropper.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../shared/models/user/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass']
})
export class UserComponent implements OnInit {
  currentUser: User = {} as User;
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
      console.log('we have cropped ' + typeof (file));
      // now we can use it for saving image logic
    }
    else {
      console.log('Image didn`t change');
    }
  }
}
