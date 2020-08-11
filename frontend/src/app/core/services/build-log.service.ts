import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BuildLogService {
  constructor() {}

  getTestBuildLog(): Observable<string> {
    return new Observable((subscriber) => {
      subscriber.next(
        `[1 08/10/2020 16:59:45 +03:00 INF] Getting Git version info`
      );
      subscriber.next(
        `[1 08/10/2020 16:59:45 +03:00 ERR] Working directory is '/home/runner/work/bsa-2020-buildeR/bsa-2020-buildeR  Working directory is '/home/runner/work/bsa-2020-buildeR/bsa-2020-buildeR  Working directory is '/home/runner/work/bsa-2020-buildeR/bsa-2020-buildeR  Working directory is '/home/runner/work/bsa-2020-buildeR/bsa-2020-buildeR  Working directory is '/home/runner/work/bsa-2020-buildeR/bsa-2020-buildeR  Working directory is '/home/runner/work/bsa-2020-buildeR/bsa-2020-buildeR'`
      );
      subscriber.next(`[1 08/10/2020 16:59:45 +03:00 INF] /usr/bin/git version`);
      subscriber.next(`[1 08/10/2020 16:59:45 +03:00 DBG] git version 2.28.0`);
      subscriber.next(`[2 08/10/2020 16:59:45 +03:00 DBG] git version 2.28.0`);
      subscriber.next(`[3 08/10/2020 16:59:45 +03:00 INF] git version 2.28.0`);
      setTimeout(() => {
        subscriber.next(`[4 08/10/2020 16:59:45 +03:00 FTL] git version 2.28.0`);
      }, 1000);
      setTimeout(() => {
        subscriber.next(`[5 08/10/2020 16:59:45 +03:00 INF]`);
      }, 3000);
      setTimeout(() => {
        subscriber.next(`[6 08/10/2020 16:59:45 +03:00 WRN] git version`);
      }, 8000);
      setTimeout(() => {
        subscriber.next(`[7 08/10/2020 16:59:45 +03:00 INF] git version`);
        subscriber.next(`[8 08/10/2020 16:59:45 +03:00 INF] git version 2.28.0`);
      }, 10000);
      setTimeout(() => {
        subscriber.next(
          `[8 08/10/2020 16:59:45 +03:00 INF] Getting Git version info`
        );
        subscriber.next(
          `[8 08/10/2020 16:59:45 +03:00 ERR] Working directory is '/home/runner/work/bsa-2020-buildeR/bsa-2020-buildeR'`
        );
        subscriber.next(
          `[8 08/10/2020 16:59:45 +03:00 INF] /usr/bin/git version`
        );
        subscriber.next(`[9 08/10/2020 16:59:45 +03:00 DBG] git version 2.28.0`);
      }, 11000);
    });
  }
}
