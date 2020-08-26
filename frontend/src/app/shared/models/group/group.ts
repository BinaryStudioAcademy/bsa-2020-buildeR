import { Project } from '../project/project';
import { TeamMember } from './team-member';

export interface Group {
  id: number;
  isPublic: boolean;
  name: string;
  projectGroups: Project[];
  teamMembers: TeamMember[];
}
