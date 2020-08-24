import { PluginCommand } from './plugin-command';
import { EnvVariable } from './env-variable';

export interface BuildStep {
  id: number;
  index: number;
  buildStepName: string;
  pluginCommand: PluginCommand;
  pluginCommandId: number;
  workDirectory: string;
  projectId: number;
  envVaiables: EnvVariable[];
}
