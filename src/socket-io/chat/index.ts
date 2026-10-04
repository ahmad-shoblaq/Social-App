import { Server, Socket } from "socket.io";
import { ChatRepository, MessageRepository } from "../../DB";

export const sendMessage=(socket:Socket,io:Server,connectedUsers:Map<string,string>)=>{
    return async(data:{message:string;destid:string})=>{
    const destSocket = connectedUsers.get(data.destid);
    socket.emit('successMessage',data);
    io.to(destSocket).emit('receiveMessage',data);

    // create message
    const messageRepository= new MessageRepository();
    const senderId = socket.data.user.id;
    const createdMessage = await messageRepository.create({content:data.message,sender:senderId});
    
    // create new chat or push message in old chat
    const chatRepository= new ChatRepository();
    const chatExist = await chatRepository.getOne({users:{$all:[senderId,data.destid]}});

    if(!chatExist){
        await chatRepository.create({users:[senderId,data.destid],messages:[createdMessage.id]});
    }else{
        await chatRepository.update({_id:chatExist._id},{$push:{messages:createdMessage.id}});
    }
}
}