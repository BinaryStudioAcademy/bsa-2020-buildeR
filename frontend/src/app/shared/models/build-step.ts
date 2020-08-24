import { PluginCommand } from './plugin-command';
import { EnvVariable } from './env-variable';
import { Arg } from './arg';

export interface BuildStep {
  id: number;
  index: number;
  buildStepName: string;
  pluginCommand: PluginCommand;
  pluginCommandId: number;
  workDirectory: string;
  projectId: number;
  envVariables: EnvVariable[];
  args: Arg[];
}
