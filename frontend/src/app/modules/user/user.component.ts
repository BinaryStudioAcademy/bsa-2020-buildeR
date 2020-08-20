import { Component, OnInit } from '@angular/core';
import { User } from "../../shared/models/user/user";
import { ActivatedRoute } from "@angular/router";
import { ModalCropperService } from "../../core/services/modal-cropper.service";
import { UserService } from "../../core/services/user.service";
import { TabRoute } from '@shared/models/tabs/tab-route';
import { FirebaseSignInService } from '@core/services/firebase-sign-in.service';
import { Providers } from '@shared/models/providers';

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
    { name: 'New settings', route: '' },
  ];

  constructor(
    private route: ActivatedRoute,
    private cropper: ModalCropperService,
    private userService: UserService,
    private fbr: FirebaseSignInService) { }

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

  linkWithGithub() {
    this.fbr.linkWithGithub();
  }

  linkWithGoogle() {
    this.fbr.linkWithGoogle();
  }

  isProviderAdded(provider: Providers) {
    for (const item of this.currentUser.userSocialNetworks) {
      if (item.socialNetworkId - 1 === Number(provider)) {
        return true;
      }
    }
    return false;
  }

}
