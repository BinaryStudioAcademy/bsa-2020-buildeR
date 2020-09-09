import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectInfo } from '@shared/models/project-info';
import { GroupService } from '@core/services/group.service';
import { BaseComponent } from '@core/components/base/base.component';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Group } from '@shared/models/group/group';
import { AuthenticationService } from '@core/services/authentication.service';
import { User } from '@shared/models/user/user';
import { ProjectService } from '@core/services/project.service';
import { ProjectGroupService } from '@core/services/project-group.service';
import { ProjectGroup } from '@shared/models/group/project-group';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { ModalService } from '@core/services/modal.service';
import { Branch } from '@core/models/Branch';

@Component({
  selector: 'app-group-projects',
  templateUrl: './group-projects.component.html',
  styleUrls: ['./group-projects.component.sass']
})
export class GroupProjectsComponent extends BaseComponent implements OnInit, OnDestroy {
  projects: ProjectInfo[];
  dropdownProjects: ProjectInfo[];
  group: Group;
  user: User = this.authService.getCurrentUser();
  groupId: number;
  isAdmin = false;
  isContributor = false;
  isBuilder = false;
  userProjects: ProjectInfo[];

  selectedProjectBranches: Branch[];
  loadingSelectedProjectBranches = false;
  selectedProjectBranch: string;

  constructor(
    private groupService: GroupService,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private projectService: ProjectService,
    private toastr: ToastrNotificationsService,
    private projectGroupService: ProjectGroupService,
    private modalService: ModalService) {
    super();
  }

  ngOnInit(): void {
    this.route.parent.data.subscribe((data) => {
      this.group = data.group;
      this.groupId = this.group.id;
      this.getGroupProjects();
    });

    this.projectService.getDeleteProject().pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => this.delete(this.groupId, res));

    this.getCurrentUserRole();
  }

  updateDropdown() {
    this.dropdownProjects = this.userProjects
      .filter(x => !this.projects?.map(y => y.id).includes(x.id));
  }

  addProject(project: ProjectInfo) {
    const projectGroup = {} as ProjectGroup;
    projectGroup.groupId = this.groupId;
    projectGroup.projectId = project.id;
    this.projectGroupService.addProject(projectGroup).subscribe(() => {
      this.getGroupProjects();
      this.projects.push(project);
      this.toastr.showSuccess('Project successfully added');
      this.updateDropdown();
    });
  }

  getGroupProjects(groupId: number = this.groupId) {
    this.groupService.getProjectsByGroup(groupId).pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.projects = res.body;
        if (this.userProjects) {
          this.updateDropdown();
        }
      });
  }

  getCurrentUserRole(groupId: number = this.groupId) {
    this.groupService.getMembersByGroup(groupId).pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        const role = res.body.filter(x => x.userId === this.user.id)[0]?.memberRole;
        if (role === 1) {
          this.isBuilder = true;
          this.isContributor = true;
        }
        if (role === 2) {
          this.isContributor = true;
          this.isAdmin = true;
          this.isBuilder = true;
          this.getUserProjects();
        }
        if (role === 3) {
          this.isBuilder = true;
        }
      });
  }

  getUserProjects(userId: number = this.user.id) {
    if (!this.isAdmin) {
      return;
    }
    this.projectService.getProjectsByUser(userId).pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.userProjects = res.body;
        this.updateDropdown();
      });
  }

  async delete(groupId: number, projectId: number) {
    const confirm = await this.modalService.open('Do you really want to delete this project?',
      'This action cannot be undone.');
    if (confirm) {
      this.projectGroupService.removeProject(groupId, projectId).subscribe(() => {
        this.toastr.showSuccess('Project removed successfully');
        this.getGroupProjects();
      }, (err) => this.toastr.showError(err));
    }

  }

}
