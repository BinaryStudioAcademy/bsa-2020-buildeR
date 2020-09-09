import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ProjectInfo } from '../../shared/models/project-info';
import { Project } from '@shared/models/project/project';
import { NewProject } from '@shared/models/project/new-project';
import { Observable, Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { EnviromentVariable } from '@shared/models/environment-variable/enviroment-variable';
import { BuildHistory } from '@shared/models/build-history';
import { NewBuildHistory } from '@shared/models/new-build-history';
import { UsersGroupProjects } from '@shared/models/users-group-projects';
import {Repository} from "@core/models/Repository";


@Injectable({ providedIn: 'root' })
export class ProjectService {
  routePrefix = '/projects';
  private starProject$ = new Subject<ProjectInfo>();
  private deleteProject$ = new Subject<number>();
  private copyProject$ = new Subject<number>();
  private buildProject$ = new Subject<number>();
  private projectName$ = new Subject<string>();
  private projectLevel$ = new Subject<boolean>();
  private envVariable$ = new Subject<EnviromentVariable>();
  private deleteEnvVariable$ = new Subject<EnviromentVariable>();

  projectName = this.projectName$.asObservable();
  projectLevel = this.projectLevel$.asObservable();
  envVariable = this.envVariable$.asObservable();
  deleteEnvVariable = this.deleteEnvVariable$.asObservable();

  constructor(private httpService: HttpService) { }

  getProjectsByUser(
    userId: number
  ): Observable<HttpResponse<ProjectInfo[]>> {
    return this.httpService.getFullRequest<ProjectInfo[]>(
      `${this.routePrefix}/getProjectsByUserId/${userId}`
    );
  }
  getProjectById(projectId: number): Observable<Project> {
    return this.httpService.getRequest<Project>(
      `${this.routePrefix}/${projectId}/settings`
    );
  }

  notOwnGroupsProjectsByUser(userId: number): Observable<UsersGroupProjects[]> {
    return this.httpService.getRequest<UsersGroupProjects[]>(
      `${this.routePrefix}/notOwnGroupsProjectsByUser/${userId}`
    );
  }

  createProject(newProject: NewProject): Observable<Project> {
    return this.httpService.postRequest<Project>(
      `${this.routePrefix}`,
      newProject
    );
  }
  updateProject(project: Project): Observable<Project> {
    return this.httpService.putRequest<Project>(`${this.routePrefix}`, project);
  }
  startProjectBuild(history: NewBuildHistory): Observable<BuildHistory> {
    return this.httpService.postRequest<BuildHistory>(`${this.routePrefix}/build`, history);
  }

  DeleteBuildStepsByProjectId(projectId: number){
    return this.httpService.getFullRequest(`${this.routePrefix}/deleteBuildStepsByProjectId/${projectId}`);
  }

  sendBuldProject(projectId){
    return this.buildProject$.next(projectId);
  }

  getBuldProject(){
    return this.buildProject$.asObservable();
  }

  sendCopyProject(project: number){
    return this.copyProject$.next(project);
  }

  getCopyProject(){
    return this.copyProject$.asObservable();
  }

  sendDeleteProject(project: number){
    return this.deleteProject$.next(project);
  }

  getDeleteProject(){
    return this.deleteProject$.asObservable();
  }

  sendStarProject(project: ProjectInfo){
    return this.starProject$.next(project);
  }

  getStarProject(){
    return this.starProject$.asObservable();
  }

  changeFavoriteState(projectId: number) {
    return this.httpService.postRequest(`${this.routePrefix}/markFavorite/${projectId}`, null);
  }

  deleteProject(projectId: number) {
    return this.httpService.deleteFullRequest<ProjectInfo>(`${this.routePrefix}/` + projectId);
  }
  copyProject(project: Project) {
    return this.httpService.postRequest<Project>(
      `${this.routePrefix}/copy`,
      project
    );
  }

  changeProjectName(projectName: string) {
    this.projectName$.next(projectName);
  }

  changeProjectLevel(projectLevel: boolean) {
    this.projectLevel$.next(projectLevel);
  }

  getEnvironmentVariables(projectId: number) {
    return this.httpService.getRequest<EnviromentVariable[]>
      (`${this.routePrefix}/envVar/${projectId}`);
  }

  addEnvironmentVariable(envVar: EnviromentVariable) {
    return this.httpService.postRequest<Project>(
      `${this.routePrefix}/envVar`,
      envVar
    );
  }
  deleteEnviromentVariable(envVar: EnviromentVariable) {
    return this.httpService.postRequest(`${this.routePrefix}/envVar/delete`,
      envVar);
  }

  updateEnviromentVariable(envVar: EnviromentVariable) {
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

  getRepositoryByProjectId(projectId: number){
    return this.httpService.getRequest<Repository>(`${this.routePrefix}/repository/${projectId}`);
  }

}
