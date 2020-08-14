import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ProjectInfo } from '../../shared/models/project-info';
import { Project } from '@shared/models/project/project';
import { NewProject } from '@shared/models/project/new-project';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  public routePrefix = '/projects';

  constructor(private httpService: HttpService) {}

  public getProjectsByUser(
    userId: number
  ): Observable<HttpResponse<ProjectInfo[]>> {
    return this.httpService.getFullRequest<ProjectInfo[]>(
      `${this.routePrefix}/getProjectsByUserId/${userId}`
    );
  }
  public getProjectById(projectId: number): Observable<Project> {
    return this.httpService.getRequest<Project>(
      `${this.routePrefix}/${projectId}/settings`
    );
  }
  public createProject(newProject: NewProject): Observable<Project> {
    return this.httpService.postRequest<Project>(
      `${this.routePrefix}`,
      newProject
    );
  }
  public updateProject(project: Project): Observable<Project> {
    return this.httpService.putRequest<Project>(`${this.routePrefix}`, project);
  }
  public startProjectBuild(projectId: number): Observable<any> {
    return this.httpService.postRequest<any>(
      `${this.routePrefix}/${projectId}/build`,
      null
    );
  }
}
