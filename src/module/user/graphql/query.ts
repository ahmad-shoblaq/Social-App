import { GraphQLID, GraphQLList } from "graphql";
import { userType } from "./user-type.graphql";
import { UserRepository } from "../../../DB";
import { NotFoundException } from "../../../utils";
import { isAuthenticatedGraphQL } from "../../../middleware";

export const userQuery={
        getUser:{
            args:{
                id:{type:GraphQLID}
            },
            type: userType,
            resolve:async(_,args:{id:string},context)=>{
                await isAuthenticatedGraphQL(context);
                const userRepository = new UserRepository();
                const user = await userRepository.getOne({_id:args.id});
                if(!user) throw new NotFoundException("User not found");
                return user;
            }
        },
        getAllUser:{
            type: new GraphQLList(userType),
            resolve:async(_,args,context)=>{
                await isAuthenticatedGraphQL(context);
                const userRepository = new UserRepository();
                return await userRepository.getAllUsers();
            }
        },
}