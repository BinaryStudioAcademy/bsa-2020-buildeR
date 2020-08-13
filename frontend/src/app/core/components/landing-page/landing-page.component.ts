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

  constructor(private router: Router, private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    const uid = this.authService.getUIdLocalStorage();
    if (uid !== '') {
      this.authService.signInWithUid(uid);
    }
  }

  signUpRedirect() {
    this.router.navigate(['signup']);
  }

  signInRedirect() {
    this.router.navigate(['signin']);
  }
}
