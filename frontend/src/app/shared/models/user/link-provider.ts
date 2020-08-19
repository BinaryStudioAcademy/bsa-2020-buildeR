import { Providers } from '../providers';

export interface LinkProvider {
    userId: number;
    uId: string;
    providerId: Providers;
    providerUrl: string;
}
