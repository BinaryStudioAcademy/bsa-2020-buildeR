import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { SynchronizedUser } from '../models/SynchronizedUser';
import { Repository } from '../models/Repository';
import { Branch } from '../models/Branch';
import { AuthenticationService } from './authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SynchronizationService {

  endpoint = '/synchronization';

  constructor(private httpService: HttpService, private authService: AuthenticationService) { }

  getSynchronizedUser(): Observable<SynchronizedUser> {
    throw new Error('In progress');
  }

  isGithubAccessable() {
    return localStorage.getItem('github-access-token');
  }


  getUserRepositories(): Observable<Repository[]> {

    const token = localStorage.getItem('github-access-token');

    this.httpService.setHeader('ProviderAuthorization', token);

    return this.httpService.getRequest<Repository[]>(`${this.endpoint}/repos/`);
  }

  getRepositoryBranches(projectId: number): Observable<Branch[]> {
    const token = localStorage.getItem('github-access-token');

    this.httpService.setHeader('ProviderAuthorization', token);

    return this.httpService.getRequest<Branch[]>(`${this.endpoint}/${projectId}/branches`);
  }

  checkIfRepositoryAccessable(repoUrl: string): Observable<boolean> {
    return this.httpService.postRequest<boolean>(`${this.endpoint}/repo/exist`, { link: repoUrl });
  }

  registerWebhook(projectId: number): Observable<any> {
    const token = localStorage.getItem('github-access-token');
    this.httpService.setHeader('ProviderAuthorization', token);

    return this.httpService.postRequest<any>(`${this.endpoint}/hooks/${projectId}`, null);
  }
}
