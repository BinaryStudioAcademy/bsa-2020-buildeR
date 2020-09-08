import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { BuildHistory } from '../../shared/models/build-history';

@Injectable({
  providedIn: 'root'
})
export class BuildHistoryService {

  public routePrefix = '/builds';

  constructor(private httpService: HttpService) { }

  getBuildHistoriesOfProject(projectId: number) {
    return this.httpService.getFullRequest<BuildHistory[]>(`${this.routePrefix}/project/${projectId}`);
  }

  getBuildHistoriesOfUser(userId: number) {
    return this.httpService.getFullRequest<BuildHistory[]>(`${this.routePrefix}/user/${userId}`);
  }

  getBuildHistory(buildId: number) {
    return this.httpService.getRequest<BuildHistory>(`${this.routePrefix}/${buildId}`);
  }

  getLastBuildHistoryByProject(projectId: number) {
    return this.httpService.getRequest<BuildHistory>(`${this.routePrefix}/project/${projectId}/last`);
  }
}
