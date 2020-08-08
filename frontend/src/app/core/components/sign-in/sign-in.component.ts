import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@core/services/authentication.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass']
})
export class SignInComponent implements OnInit {

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
  }

  signInWithGithub() {
    this.authService.login('fake_token');
  }

  signInwithBitbucket() {
    this.authService.login('fake_token');
  }

}
