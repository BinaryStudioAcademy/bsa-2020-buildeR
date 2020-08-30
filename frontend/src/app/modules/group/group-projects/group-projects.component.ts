import { Component, OnInit } from '@angular/core';
import { ProjectInfo } from '../../../shared/models/project-info';
import { GroupService } from '../../../core/services/group.service';
import { BaseComponent } from '@core/components/base/base.component';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-group-projects',
  templateUrl: './group-projects.component.html',
  styleUrls: ['./group-projects.component.sass']
})
export class GroupProjectsComponent extends BaseComponent implements OnInit {
  projects: ProjectInfo[];
  groupId: number;
  constructor(private groupService: GroupService, private route: ActivatedRoute) {
    super();
    route.parent.params.subscribe(
      (params) => this.groupId = params.groupId);
  }

  ngOnInit(): void {
    this.getGroupProjects(this.groupId);
  }
  getGroupProjects(groupId: number) {
    this.groupService.getProjectsByGroup(groupId).pipe(takeUntil(this.unsubscribe$)).subscribe(res => this.projects = res.body);
  }
  openCreateProjectModal() { }
}
