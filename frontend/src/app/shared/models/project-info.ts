import { BuildHistory } from './build-history';
import { User } from './user/user';

export interface ProjectInfo {
  id: number;
  name: string;
  isFavorite: boolean;
  lastBuildHistory: BuildHistory;
  owner: User;
}
