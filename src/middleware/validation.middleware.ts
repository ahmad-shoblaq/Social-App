import { NextFunction, Request, Response } from "express"
import { ZodSchema } from "zod/v3";
import { BadRequestException } from "../utils/error";
import { ZodType } from "zod";

export const isValid=(schema:ZodType)=>{
    return (req:Request,res:Response,next:NextFunction)=>{

        const data = {...req.body,...req.params,...req.query};
        const userValidation = schema.safeParse(data);
                
                if (userValidation.success==false){
                    let errMessages = userValidation.error.issues.map((issue)=>({
                        path:issue.path[0] as string,
                        message:issue.message
                    }) )
                    throw new BadRequestException("Validation error",errMessages);
                }
                next();
    }
}