import { BuildHistory } from '../build-history';
import { User } from '../user/user';

export interface Project {
  id: number;
  ownerId: number;
  name: string;
  description: string;
  isPublic: boolean;
  repositoryUrl: string;
  credentialsId: string;
  isAutoCancelBranchBuilds: boolean;
  isAutoCancelPullRequestBuilds: boolean;
  isCleanUpBeforeBuild: boolean;
  cancelAfter?: number;

  owner: User;
  buildHistories: BuildHistory[];
 // buildSteps: BuildSteps[];
 // projectTriggers: ProjectTriggers[];
}
