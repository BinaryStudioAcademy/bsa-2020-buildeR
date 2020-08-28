import { Component, OnInit } from '@angular/core';
import { ProjectInfo } from '../../../shared/models/project-info';
import { GroupService } from '../../../core/services/group.service';
import { runInThisContext } from 'vm';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-group-projects',
  templateUrl: './group-projects.component.html',
  styleUrls: ['./group-projects.component.sass']
})
export class GroupProjectsComponent implements OnInit {
  projects: ProjectInfo[];
  groupId: number;
  constructor(private groupService: GroupService, private route: ActivatedRoute) {
    route.parent.params.subscribe(
      (params) => this.groupId = params.groupId);
  }

  ngOnInit(): void {
    this.getGroupProjects(this.groupId);
  }
  getGroupProjects(groupId: number) {
    this.groupService.getProjectsByGroup(groupId).subscribe(res => this.projects = res.body);
  }
  openCreateProjectModal()
  {}
}
