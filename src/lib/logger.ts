import { openTelemetryPlugin } from "@loglayer/plugin-opentelemetry";
import { redactionPlugin } from "@loglayer/plugin-redaction";
import { OpenTelemetryTransport } from "@loglayer/transport-opentelemetry";
import { PinoTransport } from "@loglayer/transport-pino";
import { type ILogLayer, LogLayer } from "loglayer";
import { pino } from "pino";
import { serializeError } from "serialize-error";

import { env } from "~/env";
import { asyncLocalStorage } from "~/lib/async-local-storage";

export function createLogger() {
  return new LogLayer({
    errorSerializer: serializeError,
    transport: [
      new OpenTelemetryTransport({
        onError: (error) =>
          console.error("OpenTelemetry logging error:", error),
        enabled: env.NODE_ENV !== "test",
      }),
      new PinoTransport({
        logger: pino({
          level: "trace",
          transport: {
            target: "pino/file",
            options: { destination: "logs/coursefull.log", mkdir: true },
          },
        }),
      }),
      new PinoTransport({
        logger: pino({
          level: "debug",
          enabled: env.NODE_ENV === "development",
          transport: {
            target: "pino-pretty",
            options: {
              colorize: true,
            },
          },
        }),
      }),
    ],
    plugins: [
      redactionPlugin({
        paths: ["password"],
        censor: "[REDACTED]",
      }),
      openTelemetryPlugin(),
    ],
  });
}

const defaultLogger = createLogger();

export function getLogger(): ILogLayer {
  const store = asyncLocalStorage.getStore();
  if (!store) {
    return defaultLogger;
  }

  return store.logger;
}
