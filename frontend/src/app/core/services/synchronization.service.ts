import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../core/services/http.service';
import { SynchronizedUser } from '../models/SynchronizedUser';

@Injectable({
  providedIn: 'root',
})
export class SynchronizationService {

  constructor(private httpService: HttpService) {
    const accessToken = !localStorage.getItem('github-access-token');

    if (accessToken) {
      console.log('User did not authorized with github.');
      // do some things
    }

  }

  getSynchronizedUser(): Observable<SynchronizedUser> {
    return this.httpService.getRequest<SynchronizedUser>('');
  }
}
