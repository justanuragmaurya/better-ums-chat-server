import { WebSocket } from "ws"
import { User } from "../types/user"

export const handleChat = (payload:any,activeConnections:User[],ws:WebSocket)=>{

    if(payload.message=="" || payload.name==""){
        return
    }

    let currentUser = activeConnections.find((e)=>e.socket == ws);

    activeConnections.map((e)=>{
        if(currentUser?.chatroom==e.chatroom){
            e.socket.send(JSON.stringify({
                type:"chatmessage",
                payload:{
                    message:payload.message,
                    reg_no:payload.reg_no,
                    name:payload.name,
                    chatroom:currentUser.chatroom,
                    time:Date.now()
                }
            }))
        }
    })
}