import { Component, OnInit } from '@angular/core';
import { Group } from '../../../shared/models/group/group';
import { TabRoute } from '@shared/models/tabs/tab-route';
import { GroupService } from '../../../core/services/group.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { BaseComponent } from '@core/components/base/base.component';

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
    { name: 'Chat', route: 'chat'},
    { name: 'Members', route: 'members' },
    { name: 'Settings', route: 'settings' },
  ];

  constructor(
    private groupService: GroupService,
    private toastrService: ToastrNotificationsService,
    private route: ActivatedRoute
  ) {
    super();
    this.route.paramMap
      .pipe(switchMap((params) => params.getAll('groupId')))
      .subscribe((data) => (this.id = Number(data)));
    this.groupService.groupName.subscribe((res) => {
      this.group.name = res;
    });
    this.groupService.groupIsPublic.pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.group.isPublic = res;
    });
  }

  ngOnInit(): void {
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
