import { Component, OnInit, Input } from '@angular/core';
import { TabRoute } from '../../models/tabs/tab-route';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.sass']
})

export class TabsComponent implements OnInit {

  currentPath: string;
  tab = 0;
  @Input('tabRoutes') tabRoutes: TabRoute[] = [];

  constructor(private route: ActivatedRoute){}
    ngOnInit() {
      this.currentPath = this.route.snapshot.children[0].url[0].path;
      const index = this.tabRoutes.findIndex(x => x.route === this.currentPath);
      if (index > 0) {
        this.tab = index;
      }
    }

  change(id: number) {
    this.tab = id;
  }
}
