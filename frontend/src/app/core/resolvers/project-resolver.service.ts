import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { Project } from 'src/app/shared/models/project/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectResolverService implements Resolve<Project>{

  constructor(private router: Router, private projectService: ProjectService) { }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any{
    const id = parseInt(route.paramMap.get('projectId'), 10);

    return this.projectService.getProjectById(id).subscribe((proj) => {
      return proj;
      // accoridng to serer logic in case of null we getting exception
    }, (err) => {
      console.log(err);
      const path = this.router.url;
      this.router.navigateByUrl('/portal/**', { skipLocationChange: true });
    });
  }
}
