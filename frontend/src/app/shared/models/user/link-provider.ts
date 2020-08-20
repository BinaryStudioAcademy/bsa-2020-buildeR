import { Providers } from '../providers';

export interface LinkProvider {
    userId: number;
    uId: string;
    providerName: Providers;
    providerUrl: string;
}
