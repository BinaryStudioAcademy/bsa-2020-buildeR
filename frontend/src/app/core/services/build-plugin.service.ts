import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { BuildPlugin } from '@shared/models/build-plugin';

@Injectable({
  providedIn: 'root'
})
export class BuildPluginService {

  public routePrefix = '/buildPlugins';

  constructor(private httpService: HttpService) { }

  getAllPlugins(): Observable<BuildPlugin[]> {
    return this.httpService.getRequest<BuildPlugin[]>(this.routePrefix);
  }

  createBuildPlugin(buipldPlugin: BuildPlugin): Observable<BuildPlugin> {
    return this.httpService.postRequest<BuildPlugin>(`${this.routePrefix}`, buipldPlugin);
  }

  updateBuildPlugin(buipldPlugin: BuildPlugin): Observable<any> {
    return this.httpService.putRequest<BuildPlugin>(`${this.routePrefix}`, buipldPlugin);
  }

  removeBuildPlugin(buipldPlugin: BuildPlugin) {
    return this.httpService.deleteRequest(`${this.routePrefix}/${buipldPlugin.id}`);
  }

  getVersionsOfBuildPlugin(buildPluginName: string, partOfVersionTerm: string): Observable<HttpResponse<string[]>> {
    return this.httpService.getFullRequest<string[]>(`${this.routePrefix}/${buildPluginName}/versions/${partOfVersionTerm}`);
  }

  versionsLookup(buildPluginName: string, partOfVersionTerm: string): Observable<any> {
    return this.httpService.getRequest<string[]>(`${this.routePrefix}/${buildPluginName}/versions/${partOfVersionTerm}`);
  }
}
