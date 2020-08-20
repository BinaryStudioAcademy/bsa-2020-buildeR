import { BuildPlugin } from './build-plugin';
import { PluginCommand } from './plugin-command';

export interface EmptyBuildStep {
  buildPlugin: BuildPlugin;
  pluginCommand: PluginCommand;
  buildStepName: string;
}
