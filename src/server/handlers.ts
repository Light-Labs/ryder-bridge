import RyderSerial from "@lightlabs/ryderserial-proto"
import { Callback, ClientEvents, Response, RyderSerialConfig, ServerEvents } from "./events"
import { Socket } from "socket.io"

type Handle<T, E> = (payload: T, callback: Callback<E>) => void

export interface ClientEventHandlers {
    serial_open: Handle<RyderSerialConfig, string>
}

export default function (): ClientEventHandlers {
    return {
        serial_open: async function (
            payload: RyderSerialConfig,
            callback: (res: Response<string>) => void
        ) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const socket: Socket<ClientEvents, ServerEvents> = this

            const ryder_serial = new RyderSerial(payload.port, payload.options)

            process.on("unhandledRejection", error => {
                console.error("unhandled rejection!", error)
                try {
                    ryder_serial.close()
                } catch (e) {
                    /* error ignored */
                    return callback({ error: `${e}` })
                }
            })

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
