import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { userQuery } from "./module/user/graphql/query";
import { postQuery } from "./module/post/graphql/query";
import { commentQuery } from "./module/comment/graphql/query";

let query = new GraphQLObjectType({
    name:'RootQuery',
    fields:()=>({
        ...userQuery,
        ...postQuery,
        ...commentQuery,
    })
})
export const appSchema = new GraphQLSchema({
    query
});
