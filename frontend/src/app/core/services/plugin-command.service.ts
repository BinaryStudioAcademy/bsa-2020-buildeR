import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { PluginCommand } from '../../shared/models/plugin-command';

@Injectable({
  providedIn: 'root'
})
export class PluginCommandService {
  private routePrefix = '/pluginCommands';

  constructor(private httpService: HttpService) { }

  getAllCommands() {
    return this.httpService.getRequest<PluginCommand[]>(this.routePrefix);
  }

  createPluginCommand(pluginCommand: PluginCommand) {
    return this.httpService.postRequest<PluginCommand>(`${this.routePrefix}`, pluginCommand);
  }

  updatePluginCommand(pluginCommand: PluginCommand) {
    return this.httpService.putRequest<PluginCommand>(`${this.routePrefix}`, pluginCommand);
  }

  removePluginCommand(pluginCommand: PluginCommand) {
    return this.httpService.deleteRequest(`${this.routePrefix}/${pluginCommand.id}`);
  }
}
