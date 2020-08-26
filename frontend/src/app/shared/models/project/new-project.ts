import { NewRepository } from '@core/models/NewRepository';

export interface NewProject {
  name: string;
  description: string;
  isPublic: boolean;
  repository: NewRepository;
  ownerId: number;
}
