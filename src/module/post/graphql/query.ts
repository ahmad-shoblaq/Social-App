import { GraphQLID, GraphQLList } from "graphql";
import { PostRepository } from "../../../DB";
import { postType } from "./post-type.graphql";
import { NotFoundException } from "../../../utils";
import { isAuthenticatedGraphQL } from "../../../middleware";
import { getSpecificPost, getUserPosts } from "./post.services.graphql";

export const postQuery = {
    getPost:{
        type:postType,
        args:{id:{type:GraphQLID}},
        resolve: getSpecificPost,
    },
    getUserPosts: {
        type: new GraphQLList(postType),
        args:{userId:{type:GraphQLID}},
        resolve: getUserPosts,
}
}