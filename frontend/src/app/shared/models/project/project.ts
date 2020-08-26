import { BuildHistory } from '../build-history';
import { User } from '../user/user';
import { ProjectTrigger } from './project-trigger/project-trigger';
import { BuildStep } from '../build-step';
import { Repository } from '@core/models/Repository';

export interface Project {
  id: number;
  ownerId: number;
  name: string;
  description: string;
  isPublic: boolean;
  repository: Repository;
  credentialsId: string;
  isAutoCancelBranchBuilds: boolean;
  isAutoCancelPullRequestBuilds: boolean;
  isCleanUpBeforeBuild: boolean;
  isFavorite: boolean;
  cancelAfter?: number;

  owner: User;
  buildHistories: BuildHistory[];
  buildSteps: BuildStep[];
  projectTriggers: ProjectTrigger[];
}
