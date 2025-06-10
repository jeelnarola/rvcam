import express,{Router} from "express";
import { user } from "./userRouter.js";
import { auth } from "./authRouter.js";
import { course } from "./courseRouter.js";
import { subject } from "./subjectRoute.js";
import { Notice } from "./noticeRoute.js";

export const router = Router()

router.use('/user',user)
router.use('/auth',auth)
router.use('/course',course)
router.use('/subject',subject)
router.use('/notice',Notice)

