import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GithubAuthService } from '@core/services/github-auth.service';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

@Component({
  selector: 'app-github-auth-endpoint',
  templateUrl: './github-auth-endpoint.component.html',
  styleUrls: ['./github-auth-endpoint.component.sass']
})
export class GithubAuthEndpointComponent implements OnInit, OnDestroy {

  private code: string;

  private unsubscribe$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private githubService: GithubAuthService) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        takeUntil(this.unsubscribe$),
        map(params => {
        this.code = params['code'];

        this.githubService.sendCodeToApi(this.code)
          .subscribe((token) => {
            localStorage.setItem('github_token', token);
            return token;
          });
        }))
      .subscribe(params => params);
  }

}
