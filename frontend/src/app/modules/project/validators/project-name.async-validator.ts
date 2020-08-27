import { ProjectService } from '../../../core/services/project.service';
import { User } from '../../../shared/models/user/user';
import { FormControl } from '@angular/forms';
import { timer } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

export const projectNameAsyncValidator = (projectService: ProjectService, user: User) => {
  return (input: FormControl) => {
    return timer(500).pipe(
      switchMap(() => projectService.validateProjectName(user.id, input.value)),
      map((res) => res ? null : { isProjectNameTaken: true })
    );
  };
};
