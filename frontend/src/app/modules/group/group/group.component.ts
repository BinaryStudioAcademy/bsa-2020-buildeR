import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@core/components/base/base.component';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
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
    private toastrService: ToastrNotificationsService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.group = data.group;
      this.id = this.group.id;
    });
    this.groupService.groupName.subscribe((res) => {
      this.group.name = res;
    });
    this.groupService.groupIsPublic.pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.group.isPublic = res;
    });
    this.getGroup(this.id);
  }
  getGroup(groupId: number) {
    this.isLoading = true;
    this.groupService.getGroupById(groupId).pipe(takeUntil(this.unsubscribe$)).subscribe(
      (data) => {
        this.isLoading = false;
        this.group = data;
      },
      (error) => {
        this.isLoading = false;
        this.toastrService.showError(error.message, error.name);
      }
    );
  }

}
