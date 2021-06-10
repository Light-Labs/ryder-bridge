import { Options } from "@lightlabs/ryderserial-proto"

interface Error {
    error: string
}

interface Success<T> {
    data: T
}

export type Response<T> = Error | Success<T>

type IdentityId = number
type Identity = number

export interface ServerEvents {
    "serial:initialized": () => void
    "serial:opened": () => void
    "serial:lock_added": () => void
    "serial:exported:identity": () => void
}

export interface RyderSerialConfig {
    port: string
    options?: Options
}

export type Callback<T> = (res: Response<T>) => void

export interface ClientEvents {
    "serial:open": (context: RyderSerialConfig, callback: Callback<string>) => void
    "serial:export:identity": (
        context: IdentityId,
        callback: (res: Response<Identity>) => void
    ) => void
}
