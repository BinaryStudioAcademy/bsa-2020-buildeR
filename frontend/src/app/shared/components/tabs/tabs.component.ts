import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { TabRoute } from '../../models/tabs/tab-route';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@core/components/base/base.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.sass'],
  encapsulation: ViewEncapsulation.None
})

export class TabsComponent extends BaseComponent implements OnInit {

  currentPath: string;
  tab = 0;
  @Input() tabRoutes: TabRoute[] = [];

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.currentPath = this.route.snapshot.children[0]?.url[0]?.path;
    this.route.data
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
      this.change(0);
    });
    const index = this.tabRoutes.findIndex(x => x.route === this.currentPath);
    if (index > 0) {
      this.tab = index;
    }
  }

  change(id: number) {
    this.tab = id;
  }
}
