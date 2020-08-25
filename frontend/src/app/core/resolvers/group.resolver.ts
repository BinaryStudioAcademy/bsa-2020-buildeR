import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { User } from '@shared/models/user/user';
import { tap, catchError } from 'rxjs/operators/';
import { EMPTY } from 'rxjs';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { Group } from '../../shared/models/group/group';
import { GroupService } from '../services/group.service';

@Injectable({
  providedIn: 'root'
})
export class GroupResolverService implements Resolve<Group>{

  constructor(private router: Router, private groupService: GroupService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = parseInt(route.paramMap.get('groupId'), 10);
    return this.groupService.getGroupById(id).pipe(
      tap((group) => {
        if (group) {
          return group;
        } else {
          return EMPTY;
        }
      }),
      catchError(() => {
        console.log(this.router.url);
        this.router.navigateByUrl('/portal/**', { skipLocationChange: true });
        return EMPTY;
      })
    );
  }
}
