import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { BuildHistory } from '../../shared/models/build-history';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuildHistoryService {

  routePrefix = '/builds';

  private loadBuildHistoryOfProject$ = new Subject<void>();

  constructor(private httpService: HttpService) { }

  getBuildHistoriesOfProject(projectId: number) {
    return this.httpService.getFullRequest<BuildHistory[]>(`${this.routePrefix}/project/${projectId}`);
  }

  getBuildHistoriesOfUser(userId: number) {
    return this.httpService.getFullRequest<BuildHistory[]>(`${this.routePrefix}/user/${userId}`);
  }

  getSortedByStartDateHistoryByUserId(userId: number) {
    return this.httpService.getFullRequest<BuildHistory[]>(`${this.routePrefix}/user/startDate/${userId}`);
  }

  getBuildHistory(buildId: number) {
    return this.httpService.getRequest<BuildHistory>(`${this.routePrefix}/${buildId}`);
  }

  getLastBuildHistoryByProject(projectId: number) {
    return this.httpService.getRequest<BuildHistory>(`${this.routePrefix}/project/${projectId}/last`);
  }

  sendLoadBuildHistoryOfProject(){
    return this.loadBuildHistoryOfProject$.next();
  }

  getLoadBuildHistoryOfProject(){
    return this.loadBuildHistoryOfProject$.asObservable();
  }
}
