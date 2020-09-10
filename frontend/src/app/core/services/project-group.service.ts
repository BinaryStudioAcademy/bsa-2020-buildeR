import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ProjectGroup } from '../../shared/models/group/project-group';

@Injectable({
  providedIn: 'root'
})
export class ProjectGroupService {
  routePrefix = '/projectGroup';

  constructor(private httpService: HttpService) { }

  addProject(teamMember: ProjectGroup) {
    return this.httpService.postRequest<ProjectGroup>(`${this.routePrefix}`, teamMember);
  }

  removeProject(groupId: number, projectId: number) {
    return this.httpService.deleteRequest<ProjectGroup>(`${this.routePrefix}/${groupId}/${projectId}`);
  }
}
