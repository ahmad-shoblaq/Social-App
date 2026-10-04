import { IUser } from "../../../utils";
import { AbstractRepository } from "../../abstract.repository";
import { User } from "./user.model";

export class UserRepository extends AbstractRepository<IUser>{
    constructor(){
        super(User);
    }
     getAllUsers = async()=>{
        return await this.model.find();
    }
}
