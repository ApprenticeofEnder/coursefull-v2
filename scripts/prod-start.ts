import cluster from "node:cluster";
import { cpus } from "node:os";
import process from "node:process";

const numCPUs = cpus().length;

function startCluster() {
  cluster.setupPrimary({
    exec: require.resolve(".bin/next"),
    args: ["start", ...process.argv.slice(2)],
  });

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`, { code, signal });
  });
}

if (cluster.isPrimary) {
  startCluster();
}
