import type { ILogLayer } from "loglayer";
import { AsyncLocalStorage } from "node:async_hooks";

export const asyncLocalStorage = new AsyncLocalStorage<{ logger: ILogLayer }>();
