import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ProjectTrigger } from 'src/app/shared/models/project/project-trigger';
import { NewProjectTrigger } from 'src/app/shared/models/project/new-project-trigger';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TriggerService {
  public routePrefix = '/triggers';

  constructor(private httpService: HttpService) { }

  public createTrigger(newTrigger: NewProjectTrigger): Observable<ProjectTrigger> {
    return this.httpService.postRequest<ProjectTrigger>(`${this.routePrefix}`, newTrigger);
  }
}
