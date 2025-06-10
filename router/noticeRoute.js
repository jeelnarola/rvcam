import express, { Router } from "express";
import { getNotice, sendNotice } from "../controller/noticController.js";
import { authChecker } from "../middleware/authCheckerMiddleware.js";

export const Notice = Router()

Notice.post("/send",sendNotice)
Notice.get("/get",getNotice)