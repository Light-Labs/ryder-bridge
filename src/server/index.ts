import express = require("express");
import http = require("http");
import { Server, ServerOptions } from "socket.io";
import { ClientEvents, ServerEvents } from "./events";
import makeSerialHandlers from "./handlers";

const app = express();
const server = http.createServer(app);

export function createApplication(
    httpServer: http.Server,
    serverOptions: Partial<ServerOptions> = {}
): Server<ClientEvents, ServerEvents>{
    const io = new Server<ClientEvents, ServerEvents>(httpServer, serverOptions);

    const {
        serial_open
    } = makeSerialHandlers();

    io.on("connection", socket => {
        socket.on("serial:open", serial_open);
    });

    return io;
}

const port = process.env.PORT || 3000;

createApplication(
    server
);

server.listen(port, () => console.log(`server listening on port ${port}`));
