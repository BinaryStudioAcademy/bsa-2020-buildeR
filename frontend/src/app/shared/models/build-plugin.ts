export interface BuildPlugin {
  id: number;
  pluginName: string;
  command: string;
  dockerImageName: string;
}
