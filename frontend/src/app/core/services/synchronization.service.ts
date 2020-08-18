import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { SynchronizedUser } from '../models/SynchronizedUser';
import { Repository } from '../models/Repository';
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

  getUserRepositories(): Observable<Repository[]> {
    const token = localStorage.getItem('github-access-token');
    const userId = this.authService.getCurrentUser().id;

    this.httpService.setHeader('ProviderAuthorization', token);

    return this.httpService.getRequest<Repository[]>(`${this.endpoint}/repos/${userId}`);
  }
}