import { PluginCommand } from './plugin-command';

export interface BuildStep {
  id: number;
  index: number;
  buildStepName: string;
  pluginCommand: PluginCommand;
  pluginCommandId: number;
  workDirectory: string;
  projectId: number;
}
