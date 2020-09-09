import { User } from './user/user';

export interface Message {
    id: number;
    createdAt: Date;
    text: string;
    groupId: number;
    senderId: number;
    sender: User;
}
