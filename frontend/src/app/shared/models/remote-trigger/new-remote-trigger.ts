import { RemoteTriggerType } from './remote-trigger-type';

export interface NewRemoteTrigger {
  type: RemoteTriggerType;
  branch: string;
  projectId: number;
}
