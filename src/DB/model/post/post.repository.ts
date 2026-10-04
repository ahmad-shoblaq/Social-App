import { RootFilterQuery } from "mongoose";
import { IPost } from "../../../utils";
import { AbstractRepository } from "../../abstract.repository";
import { Post } from "./post.model";

export class PostRepository extends AbstractRepository<IPost>{
    constructor(){
        super(Post);
    }
    getAllPosts = async(filter?:RootFilterQuery<IPost>)=>{
        return await this.model.find(filter);
    }
}