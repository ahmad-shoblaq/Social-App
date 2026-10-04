import { GraphQLFieldConfigMap, GraphQLList, GraphQLObjectType, GraphQLOutputType, GraphQLString } from "graphql";
import { userType } from "../../user/graphql/user-type.graphql";
import { CommentRepository, UserRepository } from "../../../DB";
import { commentType } from "../../comment/graphql/comment-type.graphql";
import { IPost } from "../../../utils";

export const postType = new GraphQLObjectType({
    name:'Post',
    fields:()=>({
        _id:{type:GraphQLString},
        content:{type:GraphQLString},
        createdAt:{type:GraphQLString},
        updatedAt:{type:GraphQLString},
        user:{
            type:userType,
            resolve:async (post)=>{
                const userRepository = new UserRepository();
                return await userRepository.getOne({_id:post.userId});
            }
        },
        comments:{
            type:new GraphQLList(commentType),
            resolve: async(post)=>{
                const commentRepository = new CommentRepository();
                return await commentRepository.getAllComments({postId:post._id});
            }
        },
    })
})