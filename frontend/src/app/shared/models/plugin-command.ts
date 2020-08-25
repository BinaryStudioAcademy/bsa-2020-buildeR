import { BuildPlugin } from './build-plugin';

export interface PluginCommand {
  id: number;
  name: string;
  teplateForDocker: string;
  pluginId: number;
  plugin: BuildPlugin;
}
