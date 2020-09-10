import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { AccessTokenCheck } from '../models/AccessTokenCheck';
import { Repository } from '../models/Repository';
import { Branch } from '../models/Branch';
import { AccessToken } from '@core/models/AccessToken';

@Injectable({
  providedIn: 'root',
})
export class SynchronizationService {

  endpoint = '/synchronization';

  constructor(private httpService: HttpService) { }

  checkIfTokenValid(accessToken: AccessToken) {
    return this.httpService.postRequest<AccessTokenCheck>(`${this.endpoint}/token/valid`, accessToken);
  }

  checkIfUserHasToken(userId: number) {
    return this.httpService.getRequest<boolean>(`${this.endpoint}/user/${userId}/token/exist`);
  }

  getUserAccessToken(userId: number) {
    return this.httpService.getRequest<AccessToken>(`${this.endpoint}/${userId}/token`);
  }

  getUserRepositories(userId: number) {
    return this.httpService.getRequest<Repository[]>(`${this.endpoint}/${userId}/repos`);
  }

  getRepositoryBranches(projectId: number) {
    return this.httpService.getRequest<Branch[]>(`${this.endpoint}/${projectId}/branches`);
  }

  checkIfRepositoryAccessable(userId: number, repoUrl: string) {
    return this.httpService.postRequest<boolean>(`${this.endpoint}/${userId}/repo/exist`, { link: repoUrl });
  }

  registerWebhook(projectId: number) {
    return this.httpService.postRequest<void>(`${this.endpoint}/hooks/${projectId}`, null);
  }

  setUpUserToken(userId: number, token: AccessToken){
    return this.httpService.postRequest<void>(`${this.endpoint}/credentials/${userId}`, token);
  }
}
