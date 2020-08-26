import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@core/services/authentication.service';
import { User } from '@shared/models/user/user';

@Component({
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.sass']
})
export class InsightsComponent implements OnInit {
  user: User = this.authService.getCurrentUser();
  now: Date = new Date(Date.now());
  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
  }

}
