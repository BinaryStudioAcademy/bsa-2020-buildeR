import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { github } from '../../../environments/github.config';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
@Injectable({
  providedIn: 'root',
})
export class GithubAuthService {

  private apiEndpoint: string = '/auth';

  constructor(private readonly router: Router, private httpService: HttpService) { }

  openGithubAuthWindow(): void {
    const url = github.authEndpoint + '?' +
                'client_id=' + github.clientId + '&' +
                'scope=' + github.requestedScope;
    window.location.href = url;
  }

  sendCodeToApi(code: string): Observable<string> {
    return this.httpService.postRequest<string>(`${this.apiEndpoint}/github/${code}`, null);
  }
}
