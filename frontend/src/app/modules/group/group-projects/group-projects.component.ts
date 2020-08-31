import { Component, OnInit } from '@angular/core';
import { ProjectInfo } from '../../../shared/models/project-info';
import { GroupService } from '../../../core/services/group.service';
import { BaseComponent } from '@core/components/base/base.component';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Group } from '@shared/models/group/group';
import { AuthenticationService } from '@core/services/authentication.service';
import { User } from '@shared/models/user/user';
import { UserService } from '@core/services/user.service';
import { ProjectService } from '@core/services/project.service';
import { ProjectGroup } from '@shared/models/group/project-group';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-group-projects',
  templateUrl: './group-projects.component.html',
  styleUrls: ['./group-projects.component.sass']
})
export class GroupProjectsComponent extends BaseComponent implements OnInit {
  projects: ProjectInfo[];
  group: Group;
  user: User = this.authService.getCurrentUser();
  groupId: number;
  isAdmin = false;
  isContributor = false;
  isBuilder = false;
  userProjects: ProjectInfo[];
  constructor(private groupService: GroupService,
              private route: ActivatedRoute,
              private authService: AuthenticationService,
              private projectService: ProjectService,
              private toastr: ToastrService) {
    super();
    this.route.parent.params.subscribe(
      (params) => this.groupId = params.groupId);
    this.getCurrentUserRole();
  }

  ngOnInit(): void {
    this.getGroupProjects();
  }

  addProject(project: ProjectInfo){
    const projectGroup = {} as  ProjectGroup;
    this.projects.push(project);
    this.groupService.getGroupById(this.groupId).subscribe((res) => {
      projectGroup.groupId = this.groupId;
      projectGroup.projectId = project.id;
      res.projectGroups.push(projectGroup);
      this.groupService.updateGroup(res).subscribe(() => {
        this.toastr.success('Group successfully added');
      });
    });
  }

  getGroupProjects(groupId: number = this.groupId) {
    this.groupService.getProjectsByGroup(groupId).pipe(takeUntil(this.unsubscribe$))
    .subscribe(res => this.projects = res.body);
  }

  getCurrentUserRole(groupId: number = this.groupId){
    this.groupService.getMembersByGroup(groupId).pipe(takeUntil(this.unsubscribe$))
     .subscribe(res =>  {
       const role = res.body.filter(x => x.userId === this.user.id)[0].memberRole;
       if (role === 1){
        this.isBuilder = true;
        this.isContributor = true;
       }
       if (role === 2){
         this.isContributor = true;
         this.isAdmin = true;
         this.isBuilder = true;
         this.getUserProjects();
       }
       if (role === 3){
        this.isBuilder = true;
       }
      });
  }

  getUserProjects(userId: number = this.user.id){
    if (!this.isAdmin) {
      return;
    }
    this.projectService.getProjectsByUser(userId).pipe(takeUntil(this.unsubscribe$))
    .subscribe(res => {
      this.userProjects = res.body;
      console.log(this.userProjects);
    });
  }


  openCreateProjectModal() { }
}
