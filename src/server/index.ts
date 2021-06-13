/// `server/index.ts` is (as you might've guessed) the entry point into the server
///
/// run with `npx ts-node src/server/index.ts` to open up the server

import express = require("express")
import http = require("http")
import { Socket, Server, ServerOptions } from "socket.io"
import { ClientEvents, Response, ServerEvents } from "./events"
import config from "../config";
import RyderSerial, {Options} from "@lightlabs/ryderserial-proto"

const app = express()
const server = http.createServer(app)

export class BridgeServer {
    io: Server<ClientEvents, ServerEvents>;
    ryder_serial?: RyderSerial;
    socket?: Socket<ClientEvents, ServerEvents>;

    constructor(httpServer: http.Server, serverOptions: Partial<ServerOptions> = {}) {
        this.io = new Server<ClientEvents, ServerEvents>(httpServer, serverOptions)
        this.io.on("connection", socket => {
            this.socket = socket;
            this.socket.on("serial:open", this.serial_open)
        })
        process.on("unhandledRejection", error => {
            console.error("unhandled rejection!", error)
            try {
                this.ryder_serial?.close()
            }
            catch (_) {
                /* error ignored */
            }
        })
    }

    async serial_open(payload: { port: string, options?: Options }, callback: (res: Response<string>) => void): Promise<void> {
        this.ryder_serial = new RyderSerial(payload.port, payload.options);

        new Promise<string>((resolve, reject) => {
            if (!this.ryder_serial) {
                reject("Ryder Serial does not exist for some reason");
                return;
            }

            this.ryder_serial.on("failed", (error: Error) => {
                reject(
                    `Could not connect to the Ryder on the specified port. Wrong port or it is currently in use. The error was: ${error}`
                )
                return
            })
            this.ryder_serial.on("open", async () => {
                const response = await this.ryder_serial?.send(RyderSerial.COMMAND_INFO)
                const info = typeof response === "number" ? response.toString() : response
                if (!info || info.substr(0, 5) !== "ryder") {
                    reject(`Device at ${payload.port} does not appear to be a Ryder device`)
                } else {
                    resolve(info)
                }
                return
            })
            this.ryder_serial.on("wait_user_confirm", () => {
                resolve("Confirm or cancel on Ryder device.")
                return
            })
        })
            .then((res: string) => callback({ data: res }))
            .catch(error => callback({
                source: error,
                error: error,
            }))
            .finally(() => this.ryder_serial?.close())

        this.socket?.broadcast.emit("serial:opened")

    }
}


new BridgeServer(server);
server.listen(config.port, () => console.log(`server listening on port ${config.port}`))
