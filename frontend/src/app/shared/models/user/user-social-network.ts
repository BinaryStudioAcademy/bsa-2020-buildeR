import { Providers } from '../providers';

export interface UserSocialNetwork {
    id: number;
    provider: Providers;
    uId: string;
}
