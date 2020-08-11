import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.sass']
})
export class LandingPageComponent implements OnInit {
  isMenuCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  signUpRedirect() {
    this.router.navigate(['signup']);
  }

  signInRedirect() {
    this.router.navigate(['signin']);
  }
}
