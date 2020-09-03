import { PluginCommand } from './plugin-command';

export interface BuildPlugin {
  id: number;
  pluginName: string;
  command: string;
  DockerImageName: string;
  version: string;
  dockerRegistryName: string;
  isCollapsed: boolean;
  pluginCommands: PluginCommand[];
  newCommand: string;
}
