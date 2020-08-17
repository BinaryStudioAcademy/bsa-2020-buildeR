export interface ProjectTriggerInfo {
  id: number;
  projectId: number;
  branchHash: string;
  cronExpression: string;
  nextFireTime: Date;
  previousFireTime: Date;
}
