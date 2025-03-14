import express, { Router } from "express";
import { addSF, getSF} from "../controller/userController.js";
import { authChecker } from "../middleware/authCheckerMiddleware.js";
// import { addSF } from "../controller/userController.js";

export const user = Router();

user.post('/addSF',authChecker,addSF)
user.get('/getSF',authChecker,getSF)