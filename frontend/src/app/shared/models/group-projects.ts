import { Group } from './group/group';
import { ProjectInfo } from './project-info';

export interface GroupProjects {
  group: Group;
  projects: ProjectInfo[];
}
