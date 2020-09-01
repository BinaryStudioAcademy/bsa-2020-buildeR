import { TeamMember } from './team-member';
import { ProjectGroup } from './project-group';

export interface Group {
  id: number;
  isPublic: boolean;
  name: string;
  description: string;
  projectGroups: ProjectGroup[];
  teamMembers: TeamMember[];
}
