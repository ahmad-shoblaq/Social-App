import { NextFunction, Request, Response } from "express";
import { PostRepository } from "../../DB";
import { NotAuthorizedException, NotFoundException, REACTION } from "../../utils";
import { PostFactoryService } from "./factory";
import { CreatePostDTO } from "./post.dto";
import { addReactionProvider } from "../../utils/common/providers/react.provider";

class PostService{
    private readonly postFactoryService = new PostFactoryService();
    private readonly postRepository = new PostRepository();
    create = async(req:Request,res:Response)=>{
        // Get data from request
        const createPostDTO:CreatePostDTO = req.body;
        // factory
        const post = this.postFactoryService.createPost(createPostDTO,req.user);
        // repository 
        const createdPost = await this.postRepository.create(post);
        // send res
        res.status(201).json({message:"Post created successfully",success:true,data:{createdPost}});
    }

    addReaction = async(req:Request,res:Response)=>{
        const {id} = req.params;
        const {reaction} = req.body;
        const userId = req.user._id;

        await addReactionProvider(this.postRepository,id,userId,reaction);

        res.status(200).json({message:"Reaction updated successfully",success:true});
    }
    
    update = async(req:Request,res:Response)=>{
    const {id} = req.params;
    const {content} = req.body;

    const postExist = await this.postRepository.getOne({_id:id});
    if(!postExist) throw new NotFoundException("Post not found");
    if(req.user._id.toString() != postExist.userId.toString())
        throw new NotAuthorizedException("You are not authorized to edit this post");

    await this.postRepository.update({_id:id},{content});

    return res.status(200).json({message:"Post updated successfully",success:true});
}

    getAllPosts = async(req:Request,res:Response)=>{
    const posts = await this.postRepository.getAllPosts();
    return res.status(200).json(
        {
            message:"Done",
            success:true,
            data:{posts}
        });
    }

    getSpecific =  async(req:Request,res:Response)=>{
        const {id} = req.params;
        const post = await this.postRepository.getOne({_id:id},{},
            {populate:[
                {path:"userId",select:"fullName firstName lastName"},
                {path:"comments",match:{parentsIds:[]} }
                ]
            });

        if(!post) throw new NotFoundException("Post not found");

        return res.status(200).json({message:"Done",success:true,data:{post}});
    }

    deletePost = async(req:Request,res:Response)=>{
        const {id} = req.params;
        
        const postExist = await this.postRepository.exist({_id:id});

        if(!postExist) throw new NotFoundException("Post not found");

        console.log("req.user._id: ", req.user._id);
        console.log("postExist.userId: ", postExist.userId);
        if(req.user._id.toString() != postExist.userId.toString()) throw new NotAuthorizedException("You not authorized to delete this post");

        
        await this.postRepository.delete({_id:id});

        return res.status(200).json({message:"Post deleted successfully",success:true});
    }
}

export default new PostService();