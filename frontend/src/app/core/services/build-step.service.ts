import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { EmptyBuildStep } from '../../shared/models/empty-build-step';
import { BuildStep } from '@shared/models/build-step';

@Injectable({
  providedIn: 'root'
})
export class BuildStepService {

  public routePrefix = '/buildSteps';

  constructor(private httpService: HttpService) { }

  getEmptyBuildSteps(): Observable<HttpResponse<EmptyBuildStep[]>> {
    return this.httpService.getFullRequest<EmptyBuildStep[]>(`${this.routePrefix}/getEmptyBuildSteps`);
  }

  getBuildStepsByProject(projectId: number): Observable<HttpResponse<BuildStep[]>> {
    return this.httpService.getFullRequest<BuildStep[]>(`${this.routePrefix}/project/${projectId}`);
  }

  createBuildStep(buildStep: BuildStep): Observable<BuildStep> {
    return this.httpService.postRequest<BuildStep>(`${this.routePrefix}`, buildStep);
  }

  updateBuildStep(buildStep: BuildStep): Observable<any> {
    return this.httpService.putRequest<BuildStep>(`${this.routePrefix}`, buildStep);
  }

  removeBuildStep(buildStep: BuildStep) {
    return this.httpService.deleteRequest(`${this.routePrefix}/${buildStep.id}`);
  }

  udpateIndexesOfBuildSteps(projectId: number, newIndex: number, oldIndex: number) {
    return this.httpService.putRequest(`${this.routePrefix}/project/${projectId}/newIndex/${newIndex}/oldIndex/${oldIndex}`, null);
  }
}
