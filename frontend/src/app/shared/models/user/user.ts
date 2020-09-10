import { UserSocialNetwork } from './user-social-network';
import { BuildHistory } from '../build-history';

export interface User {
  id: number;
  role: UserRole;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  bio: string;
  avatarUrl: string;
  createdAt: Date;
  userSocialNetworks: UserSocialNetwork[];
  buildHistories: BuildHistory[];
}

export enum UserRole {
  User,
  Admin
}
