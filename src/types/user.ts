import { WebSocket } from "ws";

export interface User {
    socket: WebSocket;
    chatroom: string;
}