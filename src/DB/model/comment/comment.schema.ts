import { Schema } from "mongoose";
import { IComment } from "../../../utils";
import { reactionSchema } from "../common";


export const commentSchema = new Schema<IComment>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    postId:{
        type:Schema.Types.ObjectId,
        ref:"Post",
        required:true,
    },
    parentId:
        {
        type:Schema.Types.ObjectId,
        ref:"Comment",
        default:null,
        }
    ,
    content:{type:String,trim:true},
    reactions:[reactionSchema],
    // todo attachment
},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}});

commentSchema.virtual("replies",{
    ref:"Comment",
    localField:"_id",
    foreignField:"parentId"
});


commentSchema.pre('deleteOne',async function(next){
    const filter = typeof this.getFilter == 'function'?this.getFilter():{};
    const replies = await this.model.find({parentId:filter._id});

    if (replies.length){
        for (const reply of replies) {
            await this.model.deleteOne({_id:reply.id});
        }
    }
    next();
})