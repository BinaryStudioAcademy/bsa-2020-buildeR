import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { BuildPlugin } from '@shared/models/build-plugin';

@Injectable({
  providedIn: 'root'
})
export class BuildPluginService {

  private routePrefix = '/buildPlugins';

  constructor(private httpService: HttpService) { }

  getAllPlugins() {
    return this.httpService.getRequest<BuildPlugin[]>(this.routePrefix);
  }

  createBuildPlugin(buipldPlugin: BuildPlugin) {
    return this.httpService.postRequest<BuildPlugin>(`${this.routePrefix}`, buipldPlugin);
  }

  updateBuildPlugin(buipldPlugin: BuildPlugin) {
    return this.httpService.putRequest<BuildPlugin>(`${this.routePrefix}`, buipldPlugin);
  }

  removeBuildPlugin(buipldPlugin: BuildPlugin) {
    return this.httpService.deleteRequest(`${this.routePrefix}/${buipldPlugin.id}`);
  }

  versionsLookup(buildPluginName: string, partOfVersionTerm: string) {
    return this.httpService.postRequest<string[]>(`${this.routePrefix}/versions`,
    { buildPluginName, partOfVersionTerm });
  }
}
