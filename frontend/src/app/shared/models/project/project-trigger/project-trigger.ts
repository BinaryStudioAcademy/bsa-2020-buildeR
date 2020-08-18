export interface ProjectTrigger {
  id: number;
  projectId: number;
  branchHash: string;
  cronExpression: string;
}
