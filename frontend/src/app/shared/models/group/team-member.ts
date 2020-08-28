import { User } from '../user/user';
import { Group } from './group';
import { UserRole } from './user-role';

export interface TeamMember {
  id: number;
  userId: number;
  groupId: number;
  memberRole: UserRole;
  user: User;
  group: Group;
  joinedDate: Date;
}
