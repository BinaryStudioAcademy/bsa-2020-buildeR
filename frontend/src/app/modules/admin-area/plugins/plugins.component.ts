import { Component, OnInit } from '@angular/core';
import { BuildPluginService } from '@core/services/build-plugin.service';
import { BuildPlugin } from '@shared/models/build-plugin';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@core/components/base/base.component';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';

@Component({
  selector: 'app-plugins',
  templateUrl: './plugins.component.html',
  styleUrls: ['./plugins.component.sass']
})
export class PluginsComponent extends BaseComponent implements OnInit {
  plugins: BuildPlugin[];
  isLoading: boolean;

  constructor(private pluginService: BuildPluginService,
              private toastrService: ToastrNotificationsService) {
    super();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.getAllPlugins();
  }

  getAllPlugins() {
    this.pluginService.getAllPlugins()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (resp) => {
          this.isLoading = false;
          this.plugins = resp
            .filter(plugin => plugin.pluginName !== 'Custom command');
          this.plugins.forEach(plugin => {
            plugin.isCollapsed = true;
          });
        },
        (error) => {
          this.isLoading = false;
          this.toastrService.showError(error.message, error.name);
        });
  }

  addNewEmptyPlugin() {
    const plugin = {
      pluginName: 'New plugin',
      isCollapsed: true
    } as BuildPlugin;
    this.plugins.push(plugin);
    console.log(this.plugins);
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
