import { NextFunction, Request, Response } from "express"
import { ZodSchema } from "zod/v3";
import { BadRequestException } from "../utils/error";
import { ZodType } from "zod";

export const isValidGraphQL=(schema:ZodType,args)=>{

        const result = schema.safeParse(args);
                
                if (result.success==false){
                    let errMessages = result.error.issues.map((issue)=>({
                        path:issue.path[0] as string,
                        message:issue.message
                    }) )
                    throw new BadRequestException("Validation error",errMessages);
                }
}

