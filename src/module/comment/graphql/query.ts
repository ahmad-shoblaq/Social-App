import { GraphQLID, GraphQLList } from "graphql";
import { CommentRepository } from "../../../DB";
import { commentType } from "./comment-type.graphql";
import { NotFoundException } from "../../../utils";
import { isAuthenticatedGraphQL } from "../../../middleware";

export const commentQuery = {
        getComment:{
            args:{id:{type:GraphQLID}},
            type:commentType,
            resolve:async (_,args:{id:string},context)=>{
                await isAuthenticatedGraphQL(context);
                const commentRepository=new CommentRepository();
                const comment = await commentRepository.getOne({_id:args.id});
                if(!comment) throw new NotFoundException("User not found");
                return comment;
            }
        },
        getPostComments:{
            args:{postId:{type:GraphQLID}},
            type: new GraphQLList(commentType),
            resolve:async (_,args:{postId:string},context)=>{
                await isAuthenticatedGraphQL(context);
                const commentRepository=new CommentRepository();
                return await commentRepository.getAllComments({postId:args.postId});
            }
        }
}