import { config } from "dotenv";
import LogLevel from "./constants";

config();

export interface Config {
    host: string;
    log: number;
    port: number;
    ryder_port?: string;
}

const { RYDER_HOST, RYDER_LOG, PORT, RYDER_PORT } = process.env;

export default {
    host: RYDER_HOST || 'localhost',
    log: parseInt(RYDER_LOG!) || LogLevel.ALL,
    port: parseInt(PORT!) || 8080,
    ryder_port: RYDER_PORT,
} as Config;
