import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils";
import { UserRepository } from "../DB";
import { NotFoundException } from "../utils";

export const isAuthenticated= ()=>{

    return async (req:Request,res:Response,next:NextFunction)=>{
    const token = req.headers.authorization  as string;
    const payload = verifyToken(token);
    const userRepository = new UserRepository();
    const user = await userRepository.getOne({_id:payload._id},{},{populate:{path:'friends',select:"fullName firstName lastName"}}); 

    if(!user){
        throw new NotFoundException("User not found");
    }

    req.user = user;
    
    next();
}
}


