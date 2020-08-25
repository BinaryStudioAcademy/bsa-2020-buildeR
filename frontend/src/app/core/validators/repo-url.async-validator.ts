import { SynchronizationService } from '../services/synchronization.service';
import { FormControl } from '@angular/forms';
import { timer } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

export const repoUrlAsyncValidator = (syncService: SynchronizationService) => {
  return (input: FormControl) => {
    return timer(500).pipe(
      switchMap(() => syncService.checkIfRepositoryAccessable(input.value)),
      map((res) => res ? null : { isRepoNotAccessable: true })
    );
  };
};
