import { User } from './user/user';

export class Message {
    id: number;
    createdAt: Date;
    text: string;
    groupId: number;
    senderId: number;
    sender: User;
}
