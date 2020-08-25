import { Project } from "../project/project";
import { User } from "../user/user";

export interface Group {
  id: number;
  isPublic: boolean;
  name: string;
  projects: Project[];
  members: User[];
}
