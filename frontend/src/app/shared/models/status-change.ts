import { BuildStatus } from './build-status';

export class StatusChange {
  BuildHistoryId: number;
  Status: BuildStatus;
  Time: Date;
  UserId: number;
}
