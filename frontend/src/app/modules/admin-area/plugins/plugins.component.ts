import { Component, OnInit } from '@angular/core';
import { BuildPluginService } from '@core/services/build-plugin.service';
import { PluginCommandService } from '@core/services/plugin-command.service';
import { BuildPlugin } from '@shared/models/build-plugin';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@core/components/base/base.component';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { PluginCommand } from '@shared/models/plugin-command';

@Component({
  selector: 'app-plugins',
  templateUrl: './plugins.component.html',
  styleUrls: ['./plugins.component.sass']
})
export class PluginsComponent extends BaseComponent implements OnInit {
  plugins: BuildPlugin[];
  isLoading: boolean;

  constructor(private pluginService: BuildPluginService,
              private pluginCommandService: PluginCommandService,
              private toastrService: ToastrNotificationsService) {
    super();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.getAllPlugins();
  }

  editBuildPlugin(plugin: BuildPlugin) {
    plugin.isCollapsed = !plugin.isCollapsed;
  }

  getAllPlugins() {
    this.pluginService.getAllPlugins()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (resp) => {
          this.isLoading = false;
          this.plugins = resp
            .filter(plugin => plugin.pluginName !== 'Custom command')
            .filter(plugin => plugin.pluginName !== 'Dockerfile' );
          this.plugins.forEach(plugin => {
            plugin.isCollapsed = true;
            plugin.newCommand = '';
          });
        },
        (error) => {
          this.isLoading = false;
          this.toastrService.showError(error.message, error.name);
        });
  }

  deletePlugin(plugin: BuildPlugin) {
    this.isLoading = true;
    if (plugin.id) {
      this.pluginService.removeBuildPlugin(plugin)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (resp) => {
            this.plugins = this.plugins.filter(p => plugin.id !== p.id);
            this.getAllPlugins();
          },
          (error) => {
            this.isLoading = false;
            this.toastrService.showError(error);
          });
    }
    else {
      this.plugins = this.plugins.filter(p => plugin !== p);
      this.isLoading = false;
    }
  }

  deleteCommand(plugin: BuildPlugin, command: PluginCommand) {
    if (command.id) {
      this.pluginCommandService.removePluginCommand(command)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (resp) => {
            plugin.pluginCommands = plugin.pluginCommands.filter(c => c.id !== command.id);
          },
          (error) => {
            this.toastrService.showError(error);
          });
    }
    else {
      plugin.pluginCommands = plugin.pluginCommands.filter(c => c !== command);
    }
  }

  updatePlugins() {
    this.isLoading = true;
    this.plugins.forEach(plugin => {
      if (plugin.id) {
        this.pluginService.updateBuildPlugin(plugin)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(
            (resp) => {
              this.getAllPlugins();
            },
            (error) => {
              this.isLoading = false;
              this.toastrService.showError(error);
            });
      }
      else {
        this.pluginService.createBuildPlugin(plugin)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (resp) => {
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
            this.toastrService.showError(error);
          });
      }
    });
  }

  addNewEmptyPlugin() {
    const plugin = {
      pluginName: 'New plugin',
      isCollapsed: false,
      pluginCommands: []
    } as BuildPlugin;
    this.plugins.push(plugin);
  }

  addNewCommand(plugin: BuildPlugin) {
    const command = {
      pluginId: plugin.id,
      name: plugin.newCommand
    } as PluginCommand;
    plugin.newCommand = '';
    plugin.pluginCommands.push(command);
  }

  addNewPlugin(plugin: BuildPlugin) {
    this.pluginService.createBuildPlugin(plugin)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (resp) => {
          this.plugins.push(resp);
        },
        (error) => {
          this.isLoading = false;
          this.toastrService.showError(error.message, error.name);
        });
  }

  collapsePluginCard(plugin: BuildPlugin) {
    plugin.isCollapsed = !plugin.isCollapsed;
  }
}
