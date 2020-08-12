import { User } from './user/user';
import { BuildStatus } from './build-status';

export interface BuildHistory {
  id: number;
  // project: Project;
  performer: User;
  duration: number;
  buildAt: Date;
  branchHash: string;
  commitHash: string;
  buildStatus: BuildStatus;
}
