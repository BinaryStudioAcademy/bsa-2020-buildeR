export interface BuildPlugin {
  id: number;
  pluginName: string;
  command: string;
  DockerImageName: string;
  version: string;
  dockerRegistryName: string;
  isCollapsed: boolean;
}
