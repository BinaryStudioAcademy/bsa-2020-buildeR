import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseSignInService } from '@core/services/firebase-sign-in.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.sass']
})
export class SignUpComponent implements OnInit {

  constructor(
    private router: Router,
    private firebaseSignInService: FirebaseSignInService
  ) { }

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

  goSignIn() {
    this.router.navigate(['/signin']);
  }

}
