import express, { Router } from "express";
import { addCourse, deleteCourse, getCourse, updateCourse } from "../controller/courseController.js";

export const course = Router()

course.post('/Add',addCourse)
course.get('/show',getCourse)
course.patch('/update/:id',updateCourse)
course.delete('/delete',deleteCourse)