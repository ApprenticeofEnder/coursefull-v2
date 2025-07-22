import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { PinoInstrumentation } from "@opentelemetry/instrumentation-pino";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";

import { getLogger } from "~/lib/logger";

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "CourseFull",
    [ATTR_SERVICE_VERSION]: "2.0.0",
  }),
  spanProcessor: new SimpleSpanProcessor(new OTLPTraceExporter()),
  instrumentations: [new UndiciInstrumentation({})],
});

process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(
      () => logger.info("OTEL SDK shut down successfully."),
      (err) => logger.withError(err).error("Error shutting down OTEL SDK"),
    )
    .finally(() => process.exit(0));
});

sdk.start();

const logger = getLogger();
logger.info("OTEL SDK started.");
