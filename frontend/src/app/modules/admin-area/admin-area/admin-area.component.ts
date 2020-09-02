import { Component, OnInit } from '@angular/core';
import { TabRoute } from '@shared/models/tabs/tab-route';

@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.sass']
})
export class AdminAreaComponent implements OnInit {
  tabRoutes: TabRoute[] = [
    { name: 'Plugins', route: 'plugins' },
    { name: 'Commands', route: ''}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
