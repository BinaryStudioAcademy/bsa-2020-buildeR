export interface ProjectTrigger {
  id: string;
  projectId: string;
  branchHash: string;
  cronExpression: string;
}
