import { GroupProjects } from './group-projects';
import { GroupRole } from './group/group-role';

export interface UsersGroupProjects {
  groupProjects: GroupProjects;
  memberRole: GroupRole;
}
