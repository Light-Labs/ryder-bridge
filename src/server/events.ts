/// `events.ts` will define all the different server-side and client-side events that the web-socket will be able emit (or respond to)

import { Options } from "@lightlabs/ryderserial-proto"

// TODO--
// formalize Error type
interface Error {
    error: string
}

// TODO--
// formalize Success type
interface Success<T> {
    data: T
}

// thanks @Rust
export type Response<T> = Error | Success<T>

type IdentityId = number
type Identity = number

/**
 * All the custom server events that can occur -- this will make life easier for client code
 * and generally clearer for everybody
 */
// this will make life easier for client code
// and generally clearer for everybody
export interface ServerEvents {
    "serial:initialized": () => void
    "serial:opened": () => void
    "serial:lock_added": () => void
    "serial:exported:identity": () => void
}

// TODO--
// get rid of this ? I'm not sure if I like the idea of spaghetti types all over the file
// for one-off params...
export interface RyderSerialConfig {
    port: string
    options?: Options
}

export type Callback<T> = (res: Response<T>) => void

/**
 * All the custom client events that can occur
 */
// this will make life easier for server-side code
// and generally clearer for everybody
//
// Each event entry is structured like this:
// - the property name is the name of the event, structured in a `object:category:instance:...` sort of pattern.
// Doesn't need to be consistent length across the board, but make each grouping clear.
// consistency on size for all of them, as long as each grouping is easily understood (like `"serial:export:{app_key, owner_key, identity}")
export interface ClientEvents {
    "serial:open": (context: RyderSerialConfig, callback: Callback<string>) => void
    // serial::export::app_key
    // serial::export::owner_key
    "serial:export:identity": (
        context: IdentityId,
        callback: (res: Response<Identity>) => void
    ) => void
}
