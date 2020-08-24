export interface BuildPlugin {
  id: number;
  pluginName: string;
  runner: string;
  dockerImage: string;
  version: number;
}
