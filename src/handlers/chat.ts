import { WebSocket } from "ws"
import { User } from "../types/user"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const handleChat = async (payload: any, activeConnections: User[], ws: WebSocket) => {
    if (payload.message == "" || payload.name == "") {
        return
    }

    let currentUser = activeConnections.find((e) => e.socket == ws);
    if (!currentUser) return;

    const timestamp = new Date();

    // Send message to all users in the same chatroom
    activeConnections.map((e) => {
        if (currentUser?.chatroom == e.chatroom) {
            e.socket.send(JSON.stringify({
                type: "chatmessage",
                payload: {
                    message: payload.message,
                    reg_no: payload.reg_no,
                    name: payload.name,
                    chatroom: currentUser.chatroom,
                    time: timestamp.getTime()
                }
            }))
        }
    })

    // Save message to database
    try {
        // First find the chatroom by its string identifier
        const chatroomRecord = await prisma.chatroom.findUnique({
            where: {
                chatroom: currentUser.chatroom
            }
        });

        if (!chatroomRecord) {
            // Create the chatroom if it doesn't exist
            const newChatroom = await prisma.chatroom.create({
                data: {
                    chatroom: currentUser.chatroom
                }
            });

            // Add message with the new chatroom id
            await prisma.messages.create({
                data: {
                    name: payload.name,
                    content: payload.message,
                    reg_no: payload.reg_no,
                    time: timestamp,
                    chatroomId: newChatroom.id
                }
            });
        } else {
            // Add message with existing chatroom id
            await prisma.messages.create({
                data: {
                    name: payload.name,
                    content: payload.message,
                    reg_no: payload.reg_no,
                    time: timestamp,
                    chatroomId: chatroomRecord.id
                }
            });
        }
    } catch (error) {
        console.error("Failed to save message to database:", error);
    }
}