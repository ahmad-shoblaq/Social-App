import { PostRepository } from "../../../DB";
import { isAuthenticatedGraphQL, isValidGraphQL } from "../../../middleware";
import { NotFoundException } from "../../../utils";
import { getPostValidation, postValidation } from "./post.validation";

export const getSpecificPost = async (_, args: { id: string }, context) => {
    await isAuthenticatedGraphQL(context);

    isValidGraphQL(getPostValidation, args);

    const postRepository = new PostRepository();

    const post = await postRepository.getOne({
        _id: args.id
    });

    if (!post) {
        throw new NotFoundException("Post not found");
    }

    return post;
};

export const getUserPosts = async (_, args: { userId: string }, context) => {
    await isAuthenticatedGraphQL(context);
    const postRepository = new PostRepository();
    return await postRepository.getAllPosts({ userId: args.userId });
};
