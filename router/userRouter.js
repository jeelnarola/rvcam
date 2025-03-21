import express, { Router } from "express";
import { addSF, deleteSf, getSF, updateSF} from "../controller/userController.js";
import { authChecker } from "../middleware/authCheckerMiddleware.js";
// import { addSF } from "../controller/userController.js";

export const user = Router();

user.post('/addSF',authChecker,addSF)
user.get('/getSF',getSF)
user.patch('/updateSF/:id',authChecker,updateSF)
user.delete('/deleteSF',authChecker,deleteSf)