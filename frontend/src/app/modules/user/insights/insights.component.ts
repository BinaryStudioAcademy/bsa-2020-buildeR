import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@core/services/authentication.service';
import { User } from '@shared/models/user/user';
import { TabRoute } from '@shared/models/tabs/tab-route';

@Component({
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.sass']
})
export class InsightsComponent implements OnInit {
  user: User = this.authService.getCurrentUser();
  now: Date = new Date(Date.now());
  tabRoutes: TabRoute[] = [
    { name: 'Week', route: '' },
    { name: 'Month', route: '' },
  ];

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
  }

}
