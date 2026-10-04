import { ObjectId } from "mongoose";
import { GENDER, REACTION, SYS_ROLE, USER_AGENT } from "../enum";
import de from "zod/v4/locales/de.js";

export interface IUser{
    firstName:string;
    lastName:string;
    fullName?:string;
    email:string;
    password:string
    credentialUpdatedAt:Date;
    phoneNumber?:string;
    role:SYS_ROLE;
    gender:GENDER;
    user_agent:USER_AGENT;
    otp?:string;
    otpExpiryAt:Date;
    isVerified:boolean;
    friends:ObjectId[];
}

export interface IUser{
    _id:ObjectId;
}

export interface IAttachments{
    url:string;
    id:string;
}

export interface IReaction{
    reaction:REACTION;
    userId: ObjectId;
}

export interface IPost{
    _id:ObjectId;
    userId:ObjectId;
    content:string;
    reactions:IReaction[];
    attachments?:IAttachments[];
}

export interface IComment{
    _id:ObjectId;
    postId:ObjectId;
    userId:ObjectId;
    parentId: ObjectId|null;
    content:string;
    attachment:IAttachments;
    reactions:IReaction[];
}

export interface IMessage{
    content:string;
    sender:ObjectId;
    attachments?:IAttachments[];
    reactions: IReaction[];
}

export interface IChat{
    users:ObjectId[];
    messages:ObjectId[];
}

declare module "express"{
    interface Request{
        user:IUser;
    }
}

declare module "jsonwebtoken"{
    interface JwtPayload{
        _id:string;
        role:string;
    }
}

