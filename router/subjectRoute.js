import express, { Router } from "express";
import { addSubject, deleteSubject, getSubject, updateSubject } from "../controller/subjectController.js";
import { authChecker } from "../middleware/authCheckerMiddleware.js";
// import { Router } from "express";

export const subject = Router()

subject.post('/add',authChecker,addSubject)
subject.get('/show',getSubject)
subject.patch('/update/:id',authChecker,updateSubject)
subject.delete('/delete',authChecker,deleteSubject)
