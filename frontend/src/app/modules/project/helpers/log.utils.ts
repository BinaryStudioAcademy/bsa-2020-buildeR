import { IProjectLog } from '@shared/models/project/project-log';

export const formatLog = (log: IProjectLog) =>
  `[${this.step++} ${log.timestamp} INF] ${log.message}`;
