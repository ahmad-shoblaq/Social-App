import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../../DB";
import { BadRequestException } from "../../utils";

class UserService{
    constructor(){}

    private readonly userRepository = new UserRepository();
    getProfile = async (req:Request,res:Response,next:NextFunction)=>{
        return res.status(200).json({message:"done",success:true,data:{user:req.user}});
    }
}


export default new UserService();