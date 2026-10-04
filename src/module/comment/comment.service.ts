import { Request, Response } from "express";
import { CommentRepository, PostRepository } from "../../DB";
import { IComment, IPost, NotAuthorizedException, NotFoundException } from "../../utils";
import { CommentFactoryService } from "./factory";
import { CreateCommentDTO } from "./comment.dto";
import { addReactionProvider } from "../../utils/common/providers/react.provider";

class CommentService {
    
    private readonly postRepository = new PostRepository();
    private readonly commentRepository = new CommentRepository();
    private readonly commentFactoryService = new CommentFactoryService(); 

    create = async (req:Request,res:Response)=>{
        const {id,postId} = req.params;
        const createCommentDTO:CreateCommentDTO = req.body;
        // check post existence
        const postExist = await this.postRepository.getOne({_id:postId});
        if(!postExist) throw new NotFoundException("Post is not found");
        // check comment existence
        let commentExist:IComment | any = undefined;
        console.log("Done 1");
        
        if(id){
            commentExist = await this.commentRepository.getOne({_id:id});
            if(!commentExist) throw new NotFoundException("Comment is not found");
        }

        // prepare data for comment 

        const comment = this.commentFactoryService.createComment(createCommentDTO,req.user,postExist,commentExist);
        if(!comment) console.log("Comment is not created ",comment);
        console.log("Done 3");
        
        // create into DB
        const createdComment = await this.commentRepository.create(comment);
        return res.status(201).json({message:"Comment created successfully",success:true,data:{createdComment}})
    }
    
    addReaction = async(req:Request,res:Response)=>{
            const {id} = req.params;
            const {reaction} = req.body;
            const userId = req.user._id;

        await addReactionProvider(this.commentRepository,id,userId,reaction);

            res.status(200).json({message:"Reaction updated successfully",success:true});
        }

    update = async(req:Request,res:Response)=>{
    const {id} = req.params;
    const {content} = req.body;

    const commentExist = await this.commentRepository.getOne({_id:id});
    if(!commentExist) throw new NotFoundException("Comment not found");
    if(req.user._id.toString() != commentExist.userId.toString())
        throw new NotAuthorizedException("You are not authorized to edit this comment");

    await this.commentRepository.update({_id:id},{content});

    return res.status(200).json({
        message:"Comment updated successfully",
        success:true
    });
}
        
    deleteComment = async(req:Request,res:Response)=>{
            const {id} = req.params;
            
            const commentExist = await this.commentRepository.exist({_id:id},{},{populate:{path:"postId",select:"userId"}});
    
            if(!commentExist) throw new NotFoundException("Comment not found");
    

            if(req.user._id.toString() != commentExist.userId.toString() && commentExist.userId.toString() != (commentExist.postId as unknown as IPost).userId.toString()) throw new NotAuthorizedException("You not authorized to delete this post");
    
            
            await this.commentRepository.delete({_id:id});
    
            return res.status(200).json({
                message:"Comment deleted successfully",
                success:true
            });
        }
    getSpecific =  async(req:Request,res:Response)=>{
        const {id} = req.params;
        const comment = await this.commentRepository.exist({_id:id},{},
            {populate:[
                {path:"replies"},
                ]
            });

        if(!comment) throw new NotFoundException("Comment not found");

        return res.status(200).json({
            message:"Done",
            success:true,
            data:{comment}
        });
    }
}

export default new CommentService();