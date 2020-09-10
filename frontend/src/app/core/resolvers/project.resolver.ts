import { Injectable } from '@angular/core';
import {
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Resolve,
} from '@angular/router';
import { ProjectService } from '../services/project.service';
import { Project } from 'src/app/shared/models/project/project';
import { tap, map, catchError } from 'rxjs/operators/';
import { EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectResolverService implements Resolve<Project> {
  constructor(private router: Router, private projectService: ProjectService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const projectId = Number(route.paramMap.get('projectId'));
    return this.projectService.getProjectById(projectId).pipe(
      tap((proj) => {
        return proj ?? EMPTY;
      }),
      catchError(() => {
        this.router.navigateByUrl('/portal/**', { skipLocationChange: true });
        return EMPTY;
      })
    );
  }
}
