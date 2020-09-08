import { IProjectLog } from '@shared/models/project/project-log';

export const formatLog = (log: IProjectLog, index: number) =>
  `[${index + 1} ${log.timestamp} INF] ${log.message}`;
