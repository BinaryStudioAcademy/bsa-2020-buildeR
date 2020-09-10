import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { RemoteTrigger } from '../../shared/models/remote-trigger/remote-trigger';
import { NewRemoteTrigger } from '../../shared/models/remote-trigger/new-remote-trigger';

@Injectable({
  providedIn: 'root'
})
export class RemoteTriggerService {

  readonly endpoint = '/remoteTriggers';

  constructor(private httpService: HttpService) { }

  getProjectRemoteTriggers(projectId: number) {
    return this.httpService.getRequest<RemoteTrigger[]>(`${this.endpoint}/projectTriggers/${projectId}`);
  }

  addRemoteTrigger(trigger: NewRemoteTrigger) {
    return this.httpService.postRequest<RemoteTrigger>(`${this.endpoint}`, trigger);
  }

  updateRemoteTrigger(trigger: RemoteTrigger) {
    return this.httpService.putRequest<RemoteTrigger>(`${this.endpoint}`, trigger);
  }

  deleteRemoteTrigger(triggerId: number) {
    return this.httpService.deleteRequest<void>(`${this.endpoint}/${triggerId}`);
  }
}
