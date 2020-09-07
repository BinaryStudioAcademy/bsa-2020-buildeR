import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ProjectInfo } from '../../shared/models/project-info';
import { Project } from '@shared/models/project/project';
import { NewProject } from '@shared/models/project/new-project';
import { Observable, Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { EnviromentVariable } from '@shared/models/environment-variable/enviroment-variable';
import { BuildHistory } from '@shared/models/build-history';
import { Branch } from '@core/models/Branch';
import { NewBuildHistory } from '@shared/models/new-build-history';
import { UsersGroupProjects } from '@shared/models/users-group-projects'

@Injectable({ providedIn: 'root' })
export class ProjectService {
  public routePrefix = '/projects';
  private starProject$ = new Subject<ProjectInfo>();
  private deleteProject$ = new Subject<number>();
  private copyProject$ = new Subject<number>();
  private buildProject$ = new Subject<number>();
  private projectName$ = new Subject<string>();
  private envVariable$ = new Subject<EnviromentVariable>();
  private deleteEnvVariable$ = new Subject<EnviromentVariable>();

  projectName = this.projectName$.asObservable();
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

  notOwnGroupsProjectsByUser(userId: number): Observable<UsersGroupProjects[]> {
    return this.httpService.getRequest<UsersGroupProjects[]>(
      `${this.routePrefix}/notOwnGroupsProjectsByUser/${userId}`
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
  public startProjectBuild(history: NewBuildHistory): Observable<BuildHistory> {
    return this.httpService.postRequest<BuildHistory>(
      `${this.routePrefix}/build`,
      history
    );
  }

  public DeleteBuildStepsByProjectId(projectId: number){
    return this.httpService.getFullRequest(`${this.routePrefix}/deleteBuildStepsByProjectId/${projectId}`);
  }

  public sendBuldProject(projectId){
    return this.buildProject$.next(projectId);
  }

  public getBuldProject(){
    return this.buildProject$.asObservable();
  }

  public sendCopyProject(project: number){
    return this.copyProject$.next(project);
  }

  public getCopyProject(){
    return this.copyProject$.asObservable();
  }

  public sendDeleteProject(project: number){
    return this.deleteProject$.next(project);
  }

  public getDeleteProject(){
    return this.deleteProject$.asObservable();
  }

  public sendStarProject(project: ProjectInfo){
    return this.starProject$.next(project);
  }

  public getStarProject(){
    return this.starProject$.asObservable();
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

  changeProjectName(projectName: string) {
    this.projectName$.next(projectName);
  }

  public getEnvironmentVariables(projectId: number): Observable<any> {
    return this.httpService.getRequest<EnviromentVariable[]>
      (`${this.routePrefix}/envVar/${projectId}`);
  }

  public addEnvironmentVariable(envVar: EnviromentVariable) {
    return this.httpService.postRequest<Project>(
      `${this.routePrefix}/envVar`,
      envVar
    );
  }
  public deleteEnviromentVariable(envVar: EnviromentVariable) {
    return this.httpService.postRequest(`${this.routePrefix}/envVar/delete`,
      envVar);
  }

  public updateEnviromentVariable(envVar: EnviromentVariable) {
    return this.httpService.putRequest(`${this.routePrefix}/envVar`,
      envVar);
  }

  validateProjectName(userId: number, projectName: string, projectId: number): Observable<boolean> {
    return this.httpService.getRequest<boolean>(`${this.routePrefix}/projectNameValidation/${userId}/${projectName}/${projectId}`);
  }

  editEnvVarEvent(envVar: EnviromentVariable) {
    this.envVariable$.next(envVar);
  }

  deleteEnvVarEvent(envVar: EnviromentVariable) {
    this.deleteEnvVariable$.next(envVar);
  }
}
