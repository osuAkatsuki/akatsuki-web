export interface Success<T> {
  status: "success";
  data: T;
  meta: Record<string, any>;
}

export interface Failure {
  status: "error";
  error: string;
  message: string;
  meta?: Record<string, any>;
}
