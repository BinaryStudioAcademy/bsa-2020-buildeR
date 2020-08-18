import { Component, OnInit } from '@angular/core';
import { FirebaseSignInService } from '@core/services/firebase-sign-in.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass']
})
export class SignInComponent implements OnInit {
  redirectUrl: string;

  constructor(
    private route: ActivatedRoute,
    private firebaseSignInService: FirebaseSignInService
  ) { }

  ngOnInit() {
    this.redirectUrl = this.route.snapshot.queryParams.redirectUrl ?? '/portal';
  }

  signInWithGithub() {
    this.firebaseSignInService.signInWithGithub(this.redirectUrl);
  }

  signInWithGoogle() {
    this.firebaseSignInService.signInWithGoogle(this.redirectUrl);
  }
}
