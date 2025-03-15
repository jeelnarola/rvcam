import cluster from 'node:cluster';
import os from 'node:os';
import express from 'express';
import { router } from './router/index.router.js';
import 'dotenv/config'
import { Database } from './config/databaseConfig.js';

const numCPUs = os.availableParallelism();
cluster.schedulingPolicy = cluster.SCHED_RR;
if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
  
    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
    // Restart workers if they exit
    cluster.on("exit", (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died. Restarting...`);
      cluster.fork();
    });
  } else {
    const app = express();
    app.use(express.json())
    app.use(express.urlencoded({extended:true}))
    app.use('/api',router)
    app.get("/", (req, res) => {
        return res.send(`Hello from Worker ${process.pid}`);
    });
    app.listen(8000, () => {
      Database()
      console.log(`Worker ${process.pid} started`);
    });
  }