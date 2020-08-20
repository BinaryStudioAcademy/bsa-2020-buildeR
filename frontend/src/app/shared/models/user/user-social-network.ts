import { Providers } from '../providers';

export interface UserSocialNetwork {
    id: number;
    providerName: Providers;
    uId: string;
}
