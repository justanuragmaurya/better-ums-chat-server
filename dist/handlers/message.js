"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMessages = void 0;
const chat_1 = require("./chat");
const handleMessages = (data, activeConnections, ws) => {
    const type = data.type.toString();
    console.log(type);
    const payload = data.payload;
    switch (type) {
        case "join":
            if (!payload.chatroom) {
                console.log("No room id");
                return;
            }
            activeConnections.push({ socket: ws, chatroom: payload.chatroom });
            console.log(activeConnections);
            break;
        case "chat":
            (0, chat_1.handleChat)(payload, activeConnections, ws);
            break;
        default:
            break;
    }
};
exports.handleMessages = handleMessages;
