export interface ExecutionModel {
  Id: number;
  TaskId: number;
  ExecutionTime: string;
  Status: 'pending' | 'success' | 'error';
  Log: string;
  ScriptName: string;
  ScheduledTime: string;
}
