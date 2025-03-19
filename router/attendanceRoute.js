import express, { Router } from "express";
import { addAttendance, deleteAttendance, getAttendance, updateAttendance } from "../controller/attendanceController";

const attendance = Router()

attendance.post('/add',addAttendance)
attendance.get('/show',getAttendance)
attendance.patch('/update/:id',updateAttendance)
attendance.delete('/delete',deleteAttendance)