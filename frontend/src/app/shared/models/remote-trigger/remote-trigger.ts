import { RemoteTriggerType } from './remote-trigger-type';

export interface RemoteTrigger {
  id: number;
  type: RemoteTriggerType;
  branch: string;
  projectId: number;
}
