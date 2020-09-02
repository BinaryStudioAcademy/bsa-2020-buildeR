import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { Observable } from 'rxjs';
import {BuildHistory} from '../../shared/models/build-history';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BuildHistoryService {

  public routePrefix = '/builds';

  constructor(private httpService: HttpService) { }

  getBuildHistoriesOfProject(projectId: number): Observable<HttpResponse<BuildHistory[]>> {
    return this.httpService.getFullRequest<BuildHistory[]>(`${this.routePrefix}/project/${projectId}`);
  }

  getBuildHistoriesOfUser(userId: number): Observable<HttpResponse<BuildHistory[]>> {
    return this.httpService.getFullRequest<BuildHistory[]>(`${this.routePrefix}/user/${userId}`);
  }


  getBuildHistory(buildId: number): Observable<BuildHistory> {
    return this.httpService.getRequest<BuildHistory>(`${this.routePrefix}/${buildId}`);
  }
}
