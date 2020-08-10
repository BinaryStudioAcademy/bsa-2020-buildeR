import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Project } from 'src/app/shared/models/project/project';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ProjectService } from 'src/app/core/services/project.service';


@Component({
  selector: 'app-project-resolver',
  templateUrl: './project-resolver.component.html',
  styleUrls: ['./project-resolver.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectResolverComponent implements Resolve<Project>{

  constructor(private router: Router, private projectService: ProjectService) { }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any{
    const id = parseInt(route.paramMap.get('projectId'));

    console.log('resolving for ' + id);

    return this.projectService.getProjectById(id).subscribe((proj) => {
      return proj;
      // accoridng to serer logic in case of null we getting exception
    }, (err) => {
      console.log(err);
      const path = this.router.url;
      this.router.navigate(['portal/ '], {queryParams: {path}});
    });
  }
}
