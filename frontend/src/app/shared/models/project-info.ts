import { Repository } from '@core/models/Repository';
import { BuildHistory } from './build-history';
import { User } from './user/user';

export interface ProjectInfo {
  id: number;
  name: string;
  isFavorite: boolean;
  lastBuildHistory: BuildHistory;
  repository: Repository;
  owner: User;
}
