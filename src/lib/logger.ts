import { redactionPlugin } from "@loglayer/plugin-redaction";
import { PinoTransport } from "@loglayer/transport-pino";
import { LogLayer } from "loglayer";
import { pino } from "pino";

import { env } from "~/env";

// Get the directory of the current module for resolving worker paths

const pinoSetup =
  env.NODE_ENV === "production"
    ? pino({ level: "warn" })
    : pino({
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
        level: "debug",
      });

export const log = new LogLayer({
  transport: new PinoTransport({
    logger: pinoSetup,
  }),
  plugins: [
    redactionPlugin({
      paths: ["password"],
      censor: "[REDACTED]",
    }),
  ],
});
