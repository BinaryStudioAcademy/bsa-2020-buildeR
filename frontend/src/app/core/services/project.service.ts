import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ProjectInfo } from '../../shared/models/project-info';
import { Project } from '@shared/models/project/project';
import { NewProject } from '@shared/models/project/new-project';

@Injectable({ providedIn: 'root' })
export class ProjectService {
    public routePrefix = '/api/projects';

    constructor(private httpService: HttpService) { }

    public getProjectsByUser(userId: number) {
      return this.httpService.getFullRequest<ProjectInfo[]>(`${this.routePrefix}/getProjectsByUserId/${userId}`);
  }
  public getProjectById(projectId: number) {
    return this.httpService.getFullRequest<Project>(`${this.routePrefix}/${projectId}/settings`);
  }
  public createProject(newProject: NewProject) {
    return this.httpService.postFullRequest<Project>(`${this.routePrefix}`, newProject);
  }
  public updateProject(project: Project){
    return this.httpService.putFullRequest<Project>(`${this.routePrefix}`, project);
  }
}
