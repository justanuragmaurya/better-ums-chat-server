import { WebSocket, WebSocketServer } from "ws";
import { handleMessages } from "./handlers/message";
import { User } from "./types/user";

const wss = new WebSocketServer({port:8011});

const activeConnections:User[] = []

wss.on("connection",(ws:WebSocket)=>{
    ws.on("message",(wsdata)=>{
        try{
            const data = JSON.parse(wsdata.toString());
            handleMessages(data,activeConnections,ws);
        }catch(e){
            console.error(e);
        }
    })
   
})
