import { BuildHistory } from './build-history';
import { User } from './user/user';

export interface ProjectInfo {
  id: number;
  name: string;
  lastBuildHistory: BuildHistory;
  owner: User;
}
