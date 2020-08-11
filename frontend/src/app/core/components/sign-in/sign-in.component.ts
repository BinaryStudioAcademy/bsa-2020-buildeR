import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass']
})
export class SignInComponent implements OnInit {

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  signInWithGithub() {
    this.authService.doGithubSignIn().then(() => {

    });
  }

  signInWithGoogle() {
    this.authService.doGoogleSignIn().then(() => {

    });
  }

}
