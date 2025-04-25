import cluster from 'node:cluster';
import os from 'node:os';
import express,{urlencoded} from 'express';
import cookie from 'cookie-parser'
import cors from 'cors'
import { router } from './router/index.router.js';
import 'dotenv/config'
import { Database } from './config/databaseConfig.js';
const numCPUs = os.availableParallelism();
cluster.schedulingPolicy = cluster.SCHED_RR;
if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  const app = express();
  app.use(express.json())
  app.use(urlencoded({ extended: true }))
  app.use(cors({ origin: ["https://rvcamfront.vercel.app","http://localhost:3000"], credentials: true }));
  app.use(cookie())
  app.get("/get", (req, res) => {
     res.json({msg:`Hello from Worker ${process.pid}`});
  });
  app.use('/api',router)
  app.listen(8080, () => {
    Database()
    console.log(`Worker ${process.pid} started`);
  });
}