import { Component, OnInit, OnDestroy } from '@angular/core';
import {BaseComponent} from "../../../core/components/base/base.component";
import {User} from "../../../shared/models/user/user";
import {AuthenticationService} from "../../../core/services/authentication.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserHelp} from "@shared/models/user/user-help";

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.sass'],
})
export class HelpComponent extends BaseComponent
  implements OnInit, OnDestroy {

  currentUser: User = {} as User;
  userHelp: UserHelp = {} as UserHelp;

  public helpForm: FormGroup;

  constructor(
    private authService: AuthenticationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.userHelp.email = this.currentUser.email;

    this.helpForm = new FormGroup({
      email: new FormControl(this.userHelp.email),
      subject: new FormControl(this.userHelp.subject),
      description: new FormControl(this.userHelp.description)
    });

  }

}
