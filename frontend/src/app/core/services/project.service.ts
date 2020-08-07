import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ProjectInfo } from '../../shared/models/project-info';

@Injectable({ providedIn: 'root' })
export class ProjectService {
    public routePrefix = '/api/projects';

    constructor(private httpService: HttpService) { }

    public getProjectsByUser(userId: number) {
      return this.httpService.getFullRequest<ProjectInfo[]>(`${this.routePrefix}/getProjectsByUserId/${userId}`);
  }
}
