import { IComment, IPost, IUser } from "../../../utils";
import { CreateCommentDTO } from "../comment.dto";
import { Comment } from "../entity";

export class CommentFactoryService {

    createComment(createCommentDTO:CreateCommentDTO,user:IUser,post:IPost,comment?:IComment){
        const newComment = new Comment();
        newComment.userId = user._id;
        newComment.postId = post._id||comment!.postId;
        newComment.content = createCommentDTO.content;
        newComment.reactions = [];
        newComment.parentId= comment? comment._id : null;
        return newComment;
    }
}