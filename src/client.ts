/// `client.ts` is the main entry point into the client code
///
/// run with `npx ts-node src/client.ts` to start up our client

import { io, Socket } from "socket.io-client"
import { ClientEvents, ServerEvents } from "./server/events"
import config from "./config"

const socket: Socket<ServerEvents, ClientEvents> = io("http://localhost:3000")

socket.on("connect", () => {
    console.log(`connect ${socket.id}`)

    let ryder_port: string

    if (!config.ryder_port) {
        const args = process.argv.slice(2)
        const ryder_port_idx = args.findIndex(arg => arg === "--ryder_port")
        if (ryder_port_idx !== -1 && ryder_port_idx !== args.length) {
            ryder_port = args[ryder_port_idx + 1]
        } else {
            console.log({ args })
            console.log("Missing RYDER_PORT environment variable.")
            process.exit(0)
        }
    } else {
        ryder_port = config.ryder_port
    }

    // this is opening ryder-serial at `ryder_port`
    socket.emit("serial:open", { port: ryder_port, options: { debug: true } }, res => {
        console.log(res)
    })
})

socket.on("serial:opened", () => {
    console.log("serial:opened")
})

socket.on("connect_error", err => {
    console.log(`connect_error due to ${err.message}`)
})

socket.on("disconnect", reason => {
    console.log(`disconnect due to ${reason}`)
})
