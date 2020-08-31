import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { AccessTokenCheck } from '../models/AccessTokenCheck';
import { Repository } from '../models/Repository';
import { Branch } from '../models/Branch';
import { AuthenticationService } from './authentication.service';
import { AccessToken } from '@core/models/AccessToken';

@Injectable({
  providedIn: 'root',
})
export class SynchronizationService {

  endpoint = '/synchronization';

  constructor(private httpService: HttpService, private authService: AuthenticationService) { }

  checkIfTokenValid(accessToken: AccessToken): Observable<AccessTokenCheck> {
    return this.httpService.postRequest<AccessTokenCheck>(`${this.endpoint}/token/valid`, accessToken);
  }

  checkIfUserHasToken(userId: number): Observable<boolean> {
    return this.httpService.getRequest<boolean>(`${this.endpoint}/user/${userId}/token/exist`);
  }

  getUserAccessToken(userId: number): Observable<AccessToken> {
    return this.httpService.getRequest<AccessToken>(`${this.endpoint}/${userId}/token`);
  }

  getUserRepositories(userId: number): Observable<Repository[]> {
    return this.httpService.getRequest<Repository[]>(`${this.endpoint}/${userId}/repos`);
  }

  getRepositoryBranches(projectId: number): Observable<Branch[]> {
    return this.httpService.getRequest<Branch[]>(`${this.endpoint}/${projectId}/branches`);
  }

  checkIfRepositoryAccessable(userId: number, repoUrl: string): Observable<boolean> {
    return this.httpService.postRequest<boolean>(`${this.endpoint}/${userId}/repo/exist`, { link: repoUrl });
  }

  registerWebhook(projectId: number): Observable<any> {
    return this.httpService.postRequest<any>(`${this.endpoint}/hooks/${projectId}`, null);
  }

  setUpUserToken(userId: number, token: AccessToken): Observable<void> {
    return this.httpService.postRequest<void>(`${this.endpoint}/credentials/${userId}`, token);
  }
}
