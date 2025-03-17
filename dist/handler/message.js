"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMessages = void 0;
const handleMessages = (data, activeConnections, ws) => {
    const type = data.type;
    const payload = JSON.parse(data.payload);
    // if(type=="join"){
    //     if(!payload.chatroom){
    //         console.log("No room id");
    //         return
    //     }
    //     console.log("added user to chat room : " + payload.chatroom);
    //     activeConnections.push({socket:ws,chatroom:payload.chatroom})
    // }
    // if(type=="chat"){
    //     console.log("chat")
    // }
    switch (type) {
        case "join":
            if (!payload.chatroom) {
                console.log("No room id");
                return;
            }
            console.log("added user to chat room : " + payload.chatroom);
            activeConnections.push({ socket: ws, chatroom: payload.chatroom });
            break;
        case "chat":
            console.log("chat");
            break;
        default:
            console.log("Hi");
    }
};
exports.handleMessages = handleMessages;
