import { FilterQuery, Model, MongooseOptions, MongooseUpdateQueryOptions, ProjectionType, QueryOptions, RootFilterQuery, UpdateQuery } from "mongoose";
import { IUser } from "../utils";

export abstract class AbstractRepository<T>{
    constructor(protected model:Model<T>){}

     create = async(item: Partial<T>)=>{
        const doc = new this.model(item);

        return await doc.save();
    }

     getOne = async(filter:RootFilterQuery<T>,projection?:ProjectionType<T>,options?:QueryOptions)=>{
       return await this.model.findOne(filter,projection,options);
    }

     exist = async(filter:RootFilterQuery<T>,projection?:ProjectionType<T>,options?:QueryOptions)=>{
       return await this.model.findOne(filter,projection,options);
    }

     update = async(filter:RootFilterQuery<T>,update: UpdateQuery<T>,options?:MongooseUpdateQueryOptions<T>)=>{
       return await this.model.updateOne(filter,update,options);
    }

     delete = async(filter:RootFilterQuery<T>)=>{
        return await this.model.deleteOne(filter);
    }
     getAll = async(filter:RootFilterQuery<T> = {} as RootFilterQuery<T>)=>{
        return await this.model.find(filter);
    }

}