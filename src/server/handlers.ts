/// `handlers.ts` this file holds handlers for events that clients can fire off

import RyderSerial from "@lightlabs/ryderserial-proto"
import { Callback, ClientEvents, Response, RyderSerialConfig, ServerEvents } from "./events"
import { Socket } from "socket.io"

// TODO--
// planning to implement a full-blown SocketServer class that can manage RyderSerial as an INSTANCE.
// then we can go ahead and make any methods within that class "ClientEventHandlers," essentially

// TODO--
// yuck... need to organize this flow better
// NOTE: type Handle<T, E> = (payload: T, callback: (res: Success<E> | Error) => void) => void
type Handle<T, E> = (payload: T, callback: Callback<E>) => void

export interface ClientEventHandlers {
    // NOTE: type Handle<T, E> = (payload: T, callback: (res: Success<E> | Error) => void) => void
    serial_open: Handle<RyderSerialConfig, string>
}

export default function (): ClientEventHandlers {
    return {
        serial_open: async function (
            payload: RyderSerialConfig,
            callback: (res: Response<string>) => void
        ) {
            // though it breaks my heart to toss in these eslint disable and ts-ignores...
            // type-aliasing 'this' here is extraordinarily convenient for
            // type - suggestions from VS Code
            //
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const socket: Socket<ClientEvents, ServerEvents> = this

            const ryder_serial = new RyderSerial(payload.port, payload.options)

            // TODO--
            // this can also be part of our base class (see comment below)
            process.on("unhandledRejection", error => {
                console.error("unhandled rejection!", error)
                try {
                    ryder_serial.close()
                } catch (e) {
                    /* error ignored */
                    return callback({ error: `${e}` })
                }
            })

            // TODO--
            // let's make a more elegant way to handle not only the opening of ryder-serial, but
            // let's craft up a better way to keep it around and pass it around (i.e., in a class)
            // so that we don't have a million implementations of this.
            new Promise<string>((resolve, reject) => {
                ryder_serial.on("failed", (error: Error) => {
                    reject(
                        `Could not connect to the Ryder on the specified port. Wrong port or it is currently in use. The error was: ${error}`
                    )
                    return
                })
                ryder_serial.on("open", async () => {
                    const response = await ryder_serial.send(RyderSerial.COMMAND_INFO)
                    const info = typeof response === "number" ? response.toString() : response
                    if (!info || info.substr(0, 5) !== "ryder") {
                        reject(`Device at ${payload.port} does not appear to be a Ryder device`)
                        return
                    } else {
                        resolve(info)
                        return
                    }
                })
                ryder_serial.on("wait_user_confirm", () => {
                    resolve("Confirm or cancel on Ryder device.")
                    return
                })
            })
                .then((res: string) => callback({ data: res }))
                .catch(error => callback({ error }))
                .finally(() => ryder_serial.close())
            socket.broadcast.emit("serial:opened")
        },
    }
}
