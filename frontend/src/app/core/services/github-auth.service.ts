import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { github } from '../../../environments/github.config';
@Injectable({
  providedIn: 'root',
})
export class GithubAuthService {

  constructor(private readonly router: Router) {
  }

  openGithubAuthWindow(): void {
    const url = github.authEndpoint + '?' +
                'client_id=' + github.clientId + '&' +
                'scope=' + github.requestedScope;
    window.location.href = url;
  }
}
