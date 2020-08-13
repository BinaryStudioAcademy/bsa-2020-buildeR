import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { CurrentUser } from '@shared/models/current-user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.sass']
})
export class LandingPageComponent implements OnInit {
  isMenuCollapsed = true;
  currentUser: CurrentUser = new CurrentUser();
  $authSubscription: Subscription;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  signUpRedirect() {
    this.router.navigate(['signup']);
  }

  signInRedirect() {
    this.router.navigate(['signin']);
  }
}
