import express, { Router } from "express";
import { addCourse, deleteCourse, getCourse, updateCourse } from "../controller/courseController.js";
import { authChecker } from "../middleware/authCheckerMiddleware.js";

export const course = Router()

course.post('/add',authChecker,addCourse)
course.get('/show',getCourse)
course.patch('/update/:id',authChecker,updateCourse)
course.delete('/delete',authChecker,deleteCourse)