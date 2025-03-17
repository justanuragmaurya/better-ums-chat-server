"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const message_1 = require("./handlers/message");
const wss = new ws_1.WebSocketServer({ port: 8011 });
const activeConnections = [];
wss.on("connection", (ws) => {
    ws.on("message", (wsdata) => {
        try {
            const data = JSON.parse(wsdata.toString());
            (0, message_1.handleMessages)(data, activeConnections, ws);
        }
        catch (e) {
            console.error(e);
        }
    });
});
