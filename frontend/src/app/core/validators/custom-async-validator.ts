import { UserService } from '../services/user.service';
import { FormControl } from '@angular/forms';
import { timer } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ValidateUser } from '../../shared/models/user/validate-user';

export const usernameAsyncValidator = (userService: UserService, userId: number = 0, time: number = 500) => {
  return (input: FormControl) => {
    const user = { id: userId, username: input.value} as ValidateUser;
    return timer(time).pipe(
      switchMap(() => userService.validateUsername(user)),
      map(res => {
        return !res ? null : { isUsernameExists: true };
      })
    );
  };
};
