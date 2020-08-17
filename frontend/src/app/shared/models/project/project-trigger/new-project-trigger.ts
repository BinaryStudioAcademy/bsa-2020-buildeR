export interface NewProjectTrigger {
  projectId: number;
  branchHash: string;
  cronExpression: string;
}
