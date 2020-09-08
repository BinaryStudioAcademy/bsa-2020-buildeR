import { VariableValue } from './variable-value';

export interface EnviromentVariable {
  projectId: number;
  id: string;
  data: VariableValue;
}
