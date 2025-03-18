"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChat = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const handleChat = (payload, activeConnections, ws) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.message == "" || payload.name == "") {
        return;
    }
    let currentUser = activeConnections.find((e) => e.socket == ws);
    if (!currentUser)
        return;
    const timestamp = new Date();
    // Send message to all users in the same chatroom
    activeConnections.map((e) => {
        if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.chatroom) == e.chatroom) {
            e.socket.send(JSON.stringify({
                type: "chatmessage",
                payload: {
                    message: payload.message,
                    reg_no: payload.reg_no,
                    name: payload.name,
                    chatroom: currentUser.chatroom,
                    time: timestamp.getTime()
                }
            }));
        }
    });
    // Save message to database
    try {
        // First find the chatroom by its string identifier
        const chatroomRecord = yield prisma.chatroom.findUnique({
            where: {
                chatroom: currentUser.chatroom
            }
        });
        if (!chatroomRecord) {
            // Create the chatroom if it doesn't exist
            const newChatroom = yield prisma.chatroom.create({
                data: {
                    chatroom: currentUser.chatroom
                }
            });
            // Add message with the new chatroom id
            yield prisma.messages.create({
                data: {
                    name: payload.name,
                    content: payload.message,
                    reg_no: payload.reg_no,
                    time: timestamp,
                    chatroomId: newChatroom.id
                }
            });
        }
        else {
            // Add message with existing chatroom id
            yield prisma.messages.create({
                data: {
                    name: payload.name,
                    content: payload.message,
                    reg_no: payload.reg_no,
                    time: timestamp,
                    chatroomId: chatroomRecord.id
                }
            });
        }
    }
    catch (error) {
        console.error("Failed to save message to database:", error);
    }
});
exports.handleChat = handleChat;
