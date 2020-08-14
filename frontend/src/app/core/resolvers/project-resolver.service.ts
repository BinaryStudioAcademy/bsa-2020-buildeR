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
  proj: Project;
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = parseInt(route.paramMap.get('projectId'), 10);
    return this.projectService.getProjectById(id).pipe(
      tap((proj) => {
        if (proj) {
          return proj;
        } else {
          return EMPTY;
        }
        // accoridng to serer logic in case of null we getting exception
      }),
      catchError(() => {
        console.log(this.router.url);
        this.router.navigateByUrl('/portal/**', { skipLocationChange: true });
        return EMPTY;
      })
    );
  }
}
