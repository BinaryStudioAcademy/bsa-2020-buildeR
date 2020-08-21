import { NewRepository } from '@core/models/NewRepository';

export interface NewProject {
  name: string;
  description: string;
  isPublic: boolean;
  repository: string;
  _repository: NewRepository;
  ownerId: number;
}
