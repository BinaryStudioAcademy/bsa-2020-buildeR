import { Component, OnInit } from '@angular/core';
import { FirebaseSignInService } from '@core/services/firebase-sign-in.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass']
})
export class SignInComponent implements OnInit {

  constructor(
    private router: Router,
    private firebaseSignInService: FirebaseSignInService) { }

  ngOnInit() {
  }

  signInWithGithub() {
    this.firebaseSignInService.signInWithGithub();
  }

  signInWithGoogle() {
    this.firebaseSignInService.signInWithGoogle();
  }

  back() {
    this.router.navigate(['/']);
  }

  goSignUp() {
    this.router.navigate(['/signup']);
  }

}
