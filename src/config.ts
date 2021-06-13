import { config } from "dotenv";
import LogLevel from "./constants"

config()

interface Config {
  host: string;
  log: string;
  port: string | number;
  ryder_port?: string;
}

const { RYDER_HOST, RYDER_LOG, PORT, RYDER_PORT} = process.env

export default {
  host: RYDER_HOST || "localhost",
  log: RYDER_LOG || LogLevel.ALL,
  port: PORT || 3000,
  ryder_port: RYDER_PORT,
} as Config
