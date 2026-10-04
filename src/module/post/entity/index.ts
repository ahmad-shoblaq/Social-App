import { ObjectId } from "mongoose";
import { IAttachments, IReaction } from "../../../utils";

export class Post{
    userId:ObjectId;
    content:string;
    reactions: IReaction[];
    attachment:IAttachments[];
}