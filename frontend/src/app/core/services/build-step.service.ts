import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { EmptyBuildStep } from '../../shared/models/empty-build-step';
import { BuildStep } from '@shared/models/build-step';

@Injectable({
  providedIn: 'root'
})
export class BuildStepService {

  private routePrefix = '/buildSteps';

  constructor(private httpService: HttpService) { }

  getEmptyBuildSteps() {
    return this.httpService.getFullRequest<EmptyBuildStep[]>(`${this.routePrefix}/getEmptyBuildSteps`);
  }

  getBuildStepsByProject(projectId: number) {
    return this.httpService.getFullRequest<BuildStep[]>(`${this.routePrefix}/project/${projectId}`);
  }

  createBuildStep(buildStep: BuildStep) {
    return this.httpService.postRequest<BuildStep>(`${this.routePrefix}`, buildStep);
  }

  updateBuildStep(buildStep: BuildStep) {
    return this.httpService.putRequest<BuildStep>(`${this.routePrefix}`, buildStep);
  }

  bulkUpdate(buildSteps: BuildStep[]) {
    return this.httpService.putRequest<BuildStep>(`${this.routePrefix}/bulk`, buildSteps);
  }

  removeBuildStep(buildStep: BuildStep) {
    return this.httpService.deleteRequest(`${this.routePrefix}/${buildStep.id}`);
  }

  udpateIndexesOfBuildSteps(projectId: number, newIndex: number, oldIndex: number) {
    return this.httpService.putRequest(`${this.routePrefix}/project/${projectId}/newIndex/${newIndex}/oldIndex/${oldIndex}`, null);
  }
}
