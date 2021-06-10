import { io, Socket } from "socket.io-client"
import { ClientEvents, ServerEvents } from "./server/events"

const socket: Socket<ServerEvents, ClientEvents> = io("http://localhost:3000")

socket.on("connect", () => {
    console.log(`connect ${socket.id}`)
    socket.emit("serial:open", { port: "/dev/ttys007", options: { debug: true } }, res => {
        console.log({ res })
    })
})

socket.on("connect_error", err => {
    console.log(`connect_error due to ${err.message}`)
})

socket.on("disconnect", reason => {
    console.log(`disconnect due to ${reason}`)
})
