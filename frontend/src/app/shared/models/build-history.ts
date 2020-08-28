import { User } from './user/user';
import { BuildStatus } from './build-status';
import { Project } from './project/project';

export interface BuildHistory {
  id: number;
  project: Project;
  number: number;
  performer: User;
  duration: number;
  buildAt: Date;
  startedAt: Date;
  branchHash: string;
  commitHash: string;
  buildStatus: BuildStatus;
}
