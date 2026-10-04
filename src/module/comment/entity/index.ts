import { ObjectId } from "mongoose";
import { IAttachments, IReaction } from "../../../utils";

export class Comment{
        postId:ObjectId;
        userId:ObjectId;
        parentId: ObjectId|null;
        content:string;
        attachment?:IAttachments;
        reactions:IReaction[];
} 