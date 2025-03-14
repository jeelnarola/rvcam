import express,{Router} from "express";
import { user } from "./userRouter.js";
import { auth } from "./authRouter.js";

export const router = Router()

router.use('/user',user)
router.use('/auth',auth)

