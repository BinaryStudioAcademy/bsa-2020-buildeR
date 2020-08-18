import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseSignInService } from '@core/services/firebase-sign-in.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.sass']
})
export class SignUpComponent implements OnInit {
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
