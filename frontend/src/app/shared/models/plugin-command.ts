import { BuildPlugin } from './build-plugin';
import { Arg } from './arg';

export interface PluginCommand {
  id: number;
  name: string;
  teplateForDocker: string;
  pluginId: number;
  plugin: BuildPlugin;
  args: Arg[];
}
