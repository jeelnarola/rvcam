import express, { Router } from "express";
import { login, logOut } from "../controller/authController.js";

export const auth = Router();

auth.post('/login',login)
auth.post('/logout',logOut)