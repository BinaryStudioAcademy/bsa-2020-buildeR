import { SynchronizationService } from '../services/synchronization.service';
import { FormGroup } from '@angular/forms';
import { timer } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { AccessToken } from '../models/AccessToken';

export const userCredentialsAsyncValidator = (syncService: SynchronizationService) => {
  return (form: FormGroup) => {
    return timer(500).pipe(
      switchMap(() => syncService.checkIfTokenValid(form.value as AccessToken)),
      map((res) => res.isSucceed ? null : { invalidToken: res })
    );
  };
};
