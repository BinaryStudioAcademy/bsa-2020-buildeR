import { SynchronizationService } from '../services/synchronization.service';
import { FormControl } from '@angular/forms';
import { timer } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { User } from '@shared/models/user/user';

export const repoUrlAsyncValidator = (syncService: SynchronizationService, user: User) => {
  return (input: FormControl) => {
    return timer(500).pipe(
      switchMap(() => syncService.checkIfRepositoryAccessable(user.id, input.value)),
      map((res) => res ? null : { isRepoNotAccessable: true })
    );
  };
};
