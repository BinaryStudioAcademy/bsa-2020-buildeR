import { User } from '../user/user';
import { Group } from './group';
import { GroupRole } from './group-role';

export interface TeamMember {
  id: number;
  userId: number;
  groupId: number;
  memberRole: GroupRole;
  user: User;
  group: Group;
  joinedDate: Date;
  isAccepted: boolean;
}
