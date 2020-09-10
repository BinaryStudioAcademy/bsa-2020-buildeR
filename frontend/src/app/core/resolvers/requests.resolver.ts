import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { tap, catchError } from 'rxjs/operators/';
import { EMPTY } from 'rxjs';
import { UserService } from '../services/user.service';
import {UserLetter} from '../../shared/models/user/user-letter';

@Injectable({
  providedIn: 'root'
})
export class RequestsResolver implements Resolve<UserLetter[]>{

  constructor(private router: Router, private userService: UserService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userService.getAllUserLetters().pipe(tap((resp) => {
      return resp ?? EMPTY;
    }), catchError(() => {
      this.router.navigateByUrl('/portal/**', { skipLocationChange: true });
      return EMPTY;
    }));
  }
}


