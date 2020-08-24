import { BuildHistory } from '../build-history';
import { User } from '../user/user';
import { ProjectTrigger } from './project-trigger/project-trigger';
import { BuildStep } from '../build-step';

export interface Project {
  id: number;
  ownerId: number;
  name: string;
  description: string;
  isPublic: boolean;
  repository: string;
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
