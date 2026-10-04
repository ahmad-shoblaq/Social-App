import { NextFunction, Request, Response, type Express } from "express";
import { connectDB } from "./DB";
import {authRouter, chatRouter, commentRouter, postRouter} from "./module"
import { AppError } from "./utils";
import { userRouter } from "./module";
import cors from "cors";
import { createHandler } from "graphql-http/lib/use/express";
import { appSchema } from "./app.schema";
import { GraphQLError } from "graphql";
export function bootstrap(app:Express,express:any){
    // auth
    // user
    // posts
    // comment
    // message

    app.use(express.json());
    app.use(cors({origin:'*'}));
    app.use('/auth',authRouter)
    app.use('/user',userRouter) 
    app.use('/post',postRouter) 
    app.use('/comment',commentRouter) 
    app.use('/chat',chatRouter) 
    app.all('/graphql',createHandler({
        schema:appSchema,
        formatError:(error:GraphQLError)=> {
            return {
                success:false,
                message: error.message,
                path: error.path,
                errorDetails: error.originalError,
                }as unknown as GraphQLError;},
        context:(req)=>({
                token:req.headers['authorization']
            }
    )}));

    app.use('/{*dummy}',(req,res,next)=>{
        return res.status(404).json({message:"invalid router", success: false});
    })
    app.use((error:AppError,req:Request,res:Response,next:NextFunction)=>{
    return res.status(error.statusCode||500).json({message:error.message,success:false});
})
    connectDB();
}