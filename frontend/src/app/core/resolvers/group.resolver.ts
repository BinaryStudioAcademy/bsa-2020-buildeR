import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { tap, catchError } from 'rxjs/operators/';
import { EMPTY } from 'rxjs';
import { Group } from '../../shared/models/group/group';
import { GroupService } from '../services/group.service';

@Injectable({
  providedIn: 'root'
})
export class GroupResolverService implements Resolve<Group>{

  constructor(private router: Router, private groupService: GroupService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let groupId: number = route.params[`groupId`];
    const parentGroupId: number = route.parent.params[`groupId`];
    if (groupId === undefined && parentGroupId !== undefined) {
      groupId = parentGroupId;
    }
    return this.groupService.getGroupById(groupId).pipe(
      tap((group) => {
        return group ?? EMPTY;
      }),
      catchError(() => {
        this.router.navigateByUrl('/portal/**', { skipLocationChange: true });
        return EMPTY;
      })
    );
  }
}
