/// `events.ts` will define all the different server-side and client-side events that the web-socket will be able emit (or respond to)

import { Options } from "@lightlabs/ryderserial-proto"

// TODO--
// formalize Error type
interface BridgeError {
    source: Error,
    error: string
}

// TODO--
// formalize Success type
interface Success<T> {
    data: T
}

export type Response<T> = BridgeError | Success<T>

type IdentityId = number
type Identity = number

/**
 * All the custom server events that can occur
 */
export interface ServerEvents {
    "serial:initialized": () => void
    "serial:opened": () => void
    "serial:lock_added": () => void
    "serial:exported:identity": () => void
}


/**
 * All the custom client events that can occur
 */
export interface ClientEvents {
    "serial:open": (context: {port: string, options?: Options}, callback: (res: Response<string>) => void) => void
    "serial:export:identity": (
        context: IdentityId,
        callback: (res: Response<Identity>) => void
    ) => void
}
