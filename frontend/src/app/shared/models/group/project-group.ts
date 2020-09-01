import { Project } from '../../models/project/project';
import { Group } from './group';

export interface ProjectGroup {
    id: number;
    projectId: number;
    groupId: number;
    project: Project;
    Group: Group;
}
