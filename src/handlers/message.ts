import { WebSocket } from "ws";
import { User} from "../types/user";
import { handleChat } from "./chat";

export const handleMessages = (data:{type:string,payload:string},activeConnections:User[],ws:WebSocket)=>{
        const type = data.type.toString();

        console.log(type);

        const payload:any = data.payload; 
        
        switch(type){
            case "join":
                
                if(!payload.chatroom){
                    console.log("No room id");
                    return
                }
                activeConnections.push({socket:ws,chatroom:payload.chatroom})
                console.log(activeConnections);
                break;

            case "chat":
                handleChat(payload,activeConnections,ws);
                break;

            default:
                break
        }
}