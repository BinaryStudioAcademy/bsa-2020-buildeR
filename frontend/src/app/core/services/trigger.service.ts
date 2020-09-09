import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ProjectTriggerInfo } from '@shared/models/project/project-trigger/project-trigger-info';
import { NewProjectTrigger } from '@shared/models/project/project-trigger/new-project-trigger';
import { Observable } from 'rxjs';
import { ProjectTrigger } from '@shared/models/project/project-trigger/project-trigger';

@Injectable({
  providedIn: 'root'
})
export class TriggerService {
  routePrefix = '/triggers';

  constructor(private httpService: HttpService) { }

  getTriggersByProjectId(projectId: number): Observable<ProjectTriggerInfo[]> {
    return this.httpService.getRequest<ProjectTriggerInfo[]>(`${this.routePrefix}/GetByProjectId/${projectId}`);
  }
  createTrigger(newTrigger: NewProjectTrigger): Observable<ProjectTriggerInfo> {
    return this.httpService.postRequest<ProjectTriggerInfo>(`${this.routePrefix}`, newTrigger);
  }
  updateTrigger(trigger: ProjectTriggerInfo): Observable<ProjectTriggerInfo> {
    return this.httpService.putRequest<ProjectTriggerInfo>(`${this.routePrefix}`, trigger);
  }
  deleteTrigger(triggerId: number) {
    return this.httpService.deleteRequest(`${this.routePrefix}/${triggerId}`);
  }
}
