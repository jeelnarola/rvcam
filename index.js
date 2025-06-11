import cluster from 'node:cluster';
import os from 'node:os';
import express, { urlencoded } from 'express';
import cookie from 'cookie-parser'
import cors from 'cors'
import { router } from './router/index.router.js';
import 'dotenv/config'
import Database from './config/database.js';
import corn from 'node-cron'
import { sendNoticesAfterDate } from './util/sendNoticeEvent.js';


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
  const allowedOrigins = [
    'http://localhost:3000',
    'https://rvcamfront.vercel.app'
  ];

  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }));


  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", req.headers.origin); // <-- Ensure dynamic origin
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    // Handle preflight
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    next();
  });

  app.use(cookie())
  app.get("/get", (req, res) => {
     res.json({msg:`Hello from Worker ${process.pid}`});
  });
  app.use('/api',router)


  corn.schedule("*/10 * * * *", () => {
  sendNoticesAfterDate();
});

let PORT = process.env.PORT || 80000

  app.listen(PORT, () => {
    Database();
    console.log(`Worker ${process.pid} started`);
  });
}


