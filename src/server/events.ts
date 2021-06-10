import { Options } from "@lightlabs/ryderserial-proto";

interface Context {
  [key: string]: any;
  key?: string;
  label?: string;
  value?: any;
}

interface ValidationErrorItem {
  message: string;
  path: Array<string | number>;
  type: string;
  context?: Context;
}

interface Error {
  error: string;
  errorDetails?: ValidationErrorItem[];
}

interface Success<T> {
  data: T;
}

export type Response<T> = Error | Success<T>;

type IdentityId = number;
type Identity = number;

export interface ServerEvents {
  "serial:initialized": () => void;
  "serial:opened": () => void;
  "serial:lock_added": () => void;
  "serial:exported:identity": () => void;
}

export interface RyderSerialConfig {
  port: string,
  options?: Options
}

export type Callback<T> = (res: Response<T>) => void

export interface ClientEvents {
  "serial:open": (context: RyderSerialConfig, callback: Callback<string>) => void;
  "serial:export:identity": (context: IdentityId, callback: (res: Response<Identity>) => void) => void;
}
