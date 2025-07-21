import { redactionPlugin } from "@loglayer/plugin-redaction";
import { PinoTransport } from "@loglayer/transport-pino";
import { LogLayer } from "loglayer";
import { type DestinationStream, type TransportMultiOptions, pino } from "pino";
import { type Options as OtelOptions } from "pino-opentelemetry-transport";
import { type PrettyOptions } from "pino-pretty";

import { env } from "~/env";

// Get the directory of the current module for resolving worker paths
const pinoTransports: DestinationStream = pino.transport<
  OtelOptions | PrettyOptions
>({
  targets: [
    {
      level: "debug",
      target: "pino-opentelemetry-transport",
      options: {
        logRecordProcessorOptions: [
          {
            recordProcessorType: "batch",
            exporterOptions: { protocol: "http" },
          },
        ],
        loggerName: "CourseFull",
        serviceVersion: "2.0.0",
        resourceAttributes: {
          "service.name": "CourseFull",
        },
      },
    },
    {
      level: env.NODE_ENV === "production" ? "info" : "debug",
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
    {
      level: "trace",
      target: "pino/file",
      options: {
        destination: "logs/coursefull.log",
        mkdir: true,
      },
    },
  ],
});

export const log = new LogLayer({
  transport: new PinoTransport({
    logger: pino(pinoTransports),
  }),
  plugins: [
    redactionPlugin({
      paths: ["password"],
      censor: "[REDACTED]",
    }),
  ],
});
