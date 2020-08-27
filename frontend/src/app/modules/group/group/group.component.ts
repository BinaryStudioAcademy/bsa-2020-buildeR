import { Component, OnInit } from '@angular/core';
import { Group } from '../../../shared/models/group/group';
import { TabRoute } from '@shared/models/tabs/tab-route';
import { GroupService } from '../../../core/services/group.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.sass']
})
export class GroupComponent implements OnInit {
  id: number;
  group: Group = {} as Group;
  isLoading = false;

  tabRoutes: TabRoute[] = [
    { name: 'Project', route: 'projects' },
    { name: 'Members', route: 'members' },
    { name: 'Settings', route: 'settings' },
  ];

  constructor(
    private groupService: GroupService,
    private toastrService: ToastrNotificationsService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap
      .pipe(switchMap((params) => params.getAll('groupId')))
      .subscribe((data) => (this.id = Number(data)));
  }

  ngOnInit(): void {
    this.getGroup(this.id);
  }
  getGroup(groupId: number) {
    this.isLoading = true;
    this.groupService.getGroupById(groupId).subscribe(
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
