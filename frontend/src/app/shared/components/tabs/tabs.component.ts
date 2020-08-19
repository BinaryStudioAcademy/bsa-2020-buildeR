import { Component, OnInit, Input } from '@angular/core';
import { TabRoute } from '../../models/tabs/tab-route'

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.sass']
})

export class TabsComponent implements OnInit {

  constructor() { }

  tab = 0;

  @Input("tabRoutes") tabRoutes : TabRoute[] = [];

  ngOnInit(): void {
  }

  change(id: number) {
    this.tab = id;
  }

}
