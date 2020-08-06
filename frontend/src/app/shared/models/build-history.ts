import { User } from './user';

export interface BuildHistory {
  id: number;
  // project: Project;
  performer: User;
  duration: number;
  buildAt: Date;
  branchHash: string;
  commitHash: string;
}
