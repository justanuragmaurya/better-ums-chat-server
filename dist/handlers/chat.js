"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChat = void 0;
const handleChat = (payload, activeConnections, ws) => {
    if (payload.message == "" || payload.name == "") {
        return;
    }
    let currentUser = activeConnections.find((e) => e.socket == ws);
    activeConnections.map((e) => {
        if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.chatroom) == e.chatroom) {
            e.socket.send(JSON.stringify({
                type: "chatmessage",
                payload: {
                    message: payload.message,
                    reg_no: payload.reg_no,
                    name: payload.name,
                    chatroom: currentUser.chatroom,
                    time: Date.now()
                }
            }));
        }
    });
};
exports.handleChat = handleChat;
