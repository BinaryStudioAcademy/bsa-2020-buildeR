import { BuildPlugin } from './build-plugin';
import { PluginCommand } from './plugin-command';
import { CommandArgument } from './command-argument';
import { BuildStep } from './build-step';

export interface EmptyBuildStep extends BuildStep {
  index: number;
  buildStepName: string;
  buildPlugin: BuildPlugin;
  pluginCommandId: number;
  workDirectory: string;
  projectId: number;
  commandArguments: CommandArgument[];
  newCommandArgumentKey: string;
  newCommandArgumentValue: string;
  isAdding: boolean;
  dockerImageVersion: string;
  pluginCommand: PluginCommand;
}
