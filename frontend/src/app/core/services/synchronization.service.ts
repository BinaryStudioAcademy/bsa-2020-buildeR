import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { SynchronizedUser } from '../models/SynchronizedUser';
import { Repository } from '../models/Repository';
import { AuthenticationService } from './authentication.service';

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
    const userId = this.authService.getUser().id;
    return this.httpService.getRequest<Repository[]>(`${this.endpoint}/repos/${userId}`);
  }
}
