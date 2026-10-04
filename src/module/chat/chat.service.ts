import { Request, Response } from "express";
import { ChatRepository } from "../../DB";
import { NotFoundException } from "../../utils";

class ChatService {
    private readonly chatRepository = new ChatRepository;
    getChat = async (req:Request,res:Response)=>{
        const {userId} = req.params;
        const userLoginId = req.user._id;

        const chatExist = await this.chatRepository.getOne({users:{$all:[userId,userLoginId]}},{},{populate:[{path:"messages"}]}); 
        if (!chatExist) throw new NotFoundException('Chat not found');

        return res.json({message:'Done',success:true,data:{chatExist}});
    }
}

export default new ChatService();