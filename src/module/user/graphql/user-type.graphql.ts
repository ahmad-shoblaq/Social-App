import { GraphQLFieldConfigMap, GraphQLID, GraphQLObjectType, GraphQLOutputType, GraphQLString } from "graphql"
import { postType } from "../../post/graphql/post-type.graphql"

export const userType:GraphQLOutputType  = new GraphQLObjectType({
                name:'User',
                fields:()=>({
                    _id:{type:GraphQLID},
                    firstName:{type:GraphQLString},
                    lastName:{type:GraphQLString},
                    email:{type:GraphQLString},
                })
})