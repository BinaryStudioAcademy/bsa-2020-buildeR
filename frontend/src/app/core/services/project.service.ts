import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ProjectInfo } from '../../shared/models/project-info';
import { Project } from '@shared/models/project/project';
import { NewProject } from '@shared/models/project/new-project';
import { Observable, Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { EnviromentVariable } from '@shared/models/environment-variable/enviroment-variable';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  public routePrefix = '/projects';
  private envVariable$ = new Subject<EnviromentVariable>();
  private deleteEnvVariable$ = new Subject<EnviromentVariable>();

  envVariable = this.envVariable$.asObservable();
  deleteEnvVariable = this.deleteEnvVariable$.asObservable();

  constructor(private httpService: HttpService) { }

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

  public changeFavoriteState(projectId: number) {
    return this.httpService.postRequest(`${this.routePrefix}/markFavorite/${projectId}`, null);
  }

  public deleteProject(projectId: number): Observable<any> {
    return this.httpService.deleteFullRequest<ProjectInfo>(`${this.routePrefix}/` + projectId);
  }
  public copyProject(project: Project): Observable<Project> {
    return this.httpService.postRequest<Project>(
      `${this.routePrefix}/copy`,
      project
    );
  }

  public getEnvironmentVariables(projectId: number): Observable<any>{
    return this.httpService.getRequest<EnviromentVariable[]>
    (`${this.routePrefix}/envVar/${projectId}`);
  }

  public addEnvironmentVariable(envVar: EnviromentVariable){
    return this.httpService.postRequest<Project>(
      `${this.routePrefix}/envVar`,
      envVar
    );
  }
  public deleteEnviromentVariable(envVar: EnviromentVariable){
    return this.httpService.postRequest(`${this.routePrefix}/envVar/delete`,
    envVar);
  }

  public updateEnviromentVariable(envVar: EnviromentVariable){
    return this.httpService.putRequest(`${this.routePrefix}/envVar`,
    envVar);
  }

  editEnvVarEvent(envVar: EnviromentVariable) {
    this.envVariable$.next(envVar);
  }

  deleteEnvVarEvent(envVar: EnviromentVariable){
    this.deleteEnvVariable$.next(envVar);
  }
}
