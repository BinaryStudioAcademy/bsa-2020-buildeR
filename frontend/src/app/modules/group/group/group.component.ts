import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@core/components/base/base.component';
import { TabRoute } from '@shared/models/tabs/tab-route';
import { takeUntil } from 'rxjs/operators';
import { GroupService } from '../../../core/services/group.service';
import { Group } from '../../../shared/models/group/group';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.sass']
})
export class GroupComponent extends BaseComponent implements OnInit {
  id: number;
  group: Group = {} as Group;
  isLoading = false;

  tabRoutes: TabRoute[] = [
    { name: 'Projects', route: 'projects' },
    { name: 'Chat', route: 'chat' },
    { name: 'Members', route: 'members' },
    { name: 'Settings', route: 'settings' },
  ];

  constructor(
    private groupService: GroupService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.group = data.group;
      this.id = this.group.id;
    });

    this.groupService.groupsChanged$.pipe(takeUntil(this.unsubscribe$)).subscribe(group => {
      if (this.group.id === group?.id) {
        this.group = group;
      }
    });
  }
}
