import { Component, OnInit, OnDestroy } from '@angular/core';
import {BaseComponent} from "../../../core/components/base/base.component";
import {User} from "../../../shared/models/user/user";
import {AuthenticationService} from "../../../core/services/authentication.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserLetter} from "@shared/models/user/user-letter";
import { emailDotValidator } from '@core/validators/email-dot-validator';
import {ToastrNotificationsService} from "@core/services/toastr-notifications.service";
import {UserService} from "@core/services/user.service";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.sass'],
})
export class HelpComponent extends BaseComponent
  implements OnInit, OnDestroy {

  currentUser: User = {} as User;
  userHelp: UserLetter = {} as UserLetter;
  currentRate: number = 0;
  isShowSpinner = false;

  public helpForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private toastrService: ToastrNotificationsService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.currentUser = data.user);
    this.userHelp.userEmail = this.currentUser.email;

    this.helpForm = new FormGroup({
      userEmail: new FormControl(this.userHelp.userEmail,
        [
          Validators.required,
          Validators.email,
          Validators.pattern(`^[a-zA-Z].*`),
          emailDotValidator()
        ]
        ),
      subject: new FormControl(this.userHelp.subject,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(200),
          Validators.pattern('^[a-zA-Z].*')
        ]),
      description: new FormControl(this.userHelp.description,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(1000),
          Validators.pattern('^[a-zA-Z].*')
        ]
        ),
    });

  }

  onSubmit(letter: UserLetter): void {
    letter.rating = this.currentRate;

    this.currentUser.firstName ? letter.userName = this.currentUser.firstName :
      letter.userName = this.currentUser.username

    console.log(letter);

    this.isShowSpinner = true;
    this.userService.sendLetter(letter).subscribe( letter =>
    {
      this.toastrService.showSuccess("Your letter was delivered! Thanks!");
      this.isShowSpinner = false;
    },
      error => {
      console.error(error.message);
      this.toastrService.showError("Your letter wasn\'t delivered!");
      this.isShowSpinner = false;
    });
  }

}
