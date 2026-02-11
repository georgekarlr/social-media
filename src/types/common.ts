export type ActionStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ActionResult<T = any> {
  status: ActionStatus;
  data?: T;
  error?: string;
}
