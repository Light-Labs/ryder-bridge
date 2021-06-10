/// `server/index.ts` is (as you might've guessed) the entry point into the server
///
/// run with `npx ts-node src/server/index.ts` to open up the server

import express = require("express")
import http = require("http")
import { Server, ServerOptions } from "socket.io"
import { ClientEvents, ServerEvents } from "./events"
import makeSerialHandlers from "./handlers"

const app = express()
const server = http.createServer(app)

// TODO--
// this function could be split into a different file?
// I only like this being a function for the eventual possibility
// that this bridge could be super configurable...
// consider if `store: T impl RyderStore` was an option here, and client code could
// somehow pass in a class that implemented an interface
// to do X, Y, and Z with Ryder... (a kid can dream, right?)
export function createApplication(
    httpServer: http.Server,
    serverOptions: Partial<ServerOptions> = {}
): Server<ClientEvents, ServerEvents> {
    const io = new Server<ClientEvents, ServerEvents>(httpServer, serverOptions)

    const { serial_open } = makeSerialHandlers()

    io.on("connection", socket => {
        socket.on("serial:open", serial_open)
    })

    return io
}

// TODO--
// let's implement at `config.ts` like Marvin did in RyderProxy... I like that pattern
const port = process.env.PORT || 3000

createApplication(server)

server.listen(port, () => console.log(`server listening on port ${port}`))
