import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthenticationService } from '@core/services/authentication.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.sass']
})
export class NotFoundComponent implements OnInit {

  link: string;
  constructor(private location: Location, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.link = this.location.path();
  }

  logout() {
    this.authService.logout();
  }
}
