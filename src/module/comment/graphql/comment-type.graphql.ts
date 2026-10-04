import { GraphQLFieldConfigMap, GraphQLID, GraphQLObjectType, GraphQLOutputType, GraphQLString } from "graphql";
import { postType } from "../../post/graphql/post-type.graphql";
import { userType } from "../../user/graphql/user-type.graphql";
import { PostRepository, User, UserRepository } from "../../../DB";

export const commentType: GraphQLOutputType = new GraphQLObjectType({
    name: "Comment",
    fields: () => {
        return {
            _id: { type: GraphQLID },
            content: { type: GraphQLString },
            user: {
                type: userType,
                resolve: async (comment) => {
                    const userRepository = new UserRepository();
                    return await userRepository.getOne({ _id: comment.userId });
                }
            },
            post: {
                type: postType,
                resolve: async (comment) => {
                    const postRepository = new PostRepository();
                    return await postRepository.getOne({ _id: comment.postId });
                }
            }
                        
        }
    }
})