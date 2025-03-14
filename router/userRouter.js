import express, { Router } from "express";

export const user = Router();

user.get('/addFS',(req,res)=>{
    res.send("Hello")
})