import { execFile } from "node:child_process";
import cluster from "node:cluster";
import { availableParallelism } from "node:os";
import process from "node:process";

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`Cluster ${process.pid} started`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`, { code, signal });
  });
} else {
  console.log(`Worker ${process.pid} started (id ${cluster.worker?.id})`);
  const port = 3000 + (cluster.worker?.id ?? 0);

  execFile(
    "node_modules/.bin/next",
    ["start", "-p", `${port}`, ...process.argv.slice(2)],
    (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
      console.log(stdout);
      console.log(stderr);
    },
  );
}
