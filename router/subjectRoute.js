import express, { Router } from "express";
import { addSubject, deleteSubject, getSubject, updateSubject } from "../controller/subjectController.js";
// import { Router } from "express";

export const subject = Router()

subject.post('/add',addSubject)
subject.get('/show',getSubject)
subject.patch('/update/:id',updateSubject)
subject.delete('/delete',deleteSubject)
