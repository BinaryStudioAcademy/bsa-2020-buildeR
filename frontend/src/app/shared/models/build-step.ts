import { PluginCommand } from './plugin-command';
import { CommandArgument } from './command-argument';

export interface BuildStep {
  id: number;
  index: number;
  buildStepName: string;
  pluginCommand: PluginCommand;
  pluginCommandId: number;
  workDirectory: string;
  projectId: number;
  commandArguments: CommandArgument[];
}
