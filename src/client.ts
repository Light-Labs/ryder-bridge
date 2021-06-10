/// `client.ts` is the main entry point into the client code
///
/// run with `npx ts-node src/client.ts` to start up our client

import { io, Socket } from "socket.io-client"
import { ClientEvents, ServerEvents } from "./server/events"

const socket: Socket<ServerEvents, ClientEvents> = io("http://localhost:3000")

socket.on("connect", () => {
    console.log(`connect ${socket.id}`)

    // TODO--
    // make port_number part of our `config.ts`
    const port_number = "/dev/ttys007"

    // this is opening ryder-serial at `port_number`
    socket.emit("serial:open", { port: port_number, options: { debug: true } }, res => {
        console.log({ res })
    })
})

socket.on("connect_error", err => {
    console.log(`connect_error due to ${err.message}`)
})

socket.on("disconnect", reason => {
    console.log(`disconnect due to ${reason}`)
})
