import { SynchronizationService } from '../services/synchronization.service';
import { FormGroup } from '@angular/forms';
import { timer } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Credentials } from '../models/Credentials';

export const userCredentialsAsyncValidator = (syncService: SynchronizationService) => {
  return (form: FormGroup) => {
    return timer(500).pipe(
      switchMap(() => syncService.checkIfUserExist(form.value as Credentials)),
      map((res) => res ? null : { userNotExist: true })
    );
  };
};
