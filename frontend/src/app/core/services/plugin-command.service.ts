import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { Observable } from 'rxjs';
import { PluginCommand } from '../../shared/models/plugin-command';


@Injectable({
  providedIn: 'root'
})
export class PluginCommandService {

  public routePrefix = '/pluginCommands';

  constructor(private httpService: HttpService) { }

  getAllCommands(): Observable<PluginCommand[]> {
    return this.httpService.getRequest<PluginCommand[]>(this.routePrefix);
  }

  createPluginCommand(pluginCommand: PluginCommand): Observable<PluginCommand> {
    return this.httpService.postRequest<PluginCommand>(`${this.routePrefix}`, pluginCommand);
  }

  updatePluginCommand(pluginCommand: PluginCommand): Observable<any> {
    return this.httpService.putRequest<PluginCommand>(`${this.routePrefix}`, pluginCommand);
  }

  removePluginCommand(pluginCommand: PluginCommand) {
    return this.httpService.deleteRequest(`${this.routePrefix}/${pluginCommand.id}`);
  }
