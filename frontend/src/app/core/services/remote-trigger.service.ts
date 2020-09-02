import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { RemoteTrigger } from '../../shared/models/remote-trigger/remote-trigger';
import { Observable } from 'rxjs';
import { NewRemoteTrigger } from '../../shared/models/remote-trigger/new-remote-trigger';

@Injectable({
  providedIn: 'root'
})
export class RemoteTriggerService {

  constructor(private httpService: HttpService) { }

  getProjectRemoteTriggers(projectId: number): Observable<RemoteTrigger[]> { }

  addRemoteTrigger(trigger: NewRemoteTrigger): Observable<NewRemoteTrigger> { }

  deleteRemoteTrigger(triggerId: number): Observable<void> { }
}
