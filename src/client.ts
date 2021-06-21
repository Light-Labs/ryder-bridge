import WebSocket from "ws";
import config from "./config"

type Options = { [key: string]: any };

export class RyderWebsocketClient {
	protected ws!: WebSocket;
	protected options: Options;
	protected connecting = false;

	protected call_id = 0;
	protected queue: Array<[Function, Function]> = [];

	constructor(options: Options) {
		this.options = Object.assign({ url: 'ws://localhost:8080' }, options);
		this.connect();
	}

	connect() {
		if (this.connecting)
			return;
		this.connecting = true;
		if (this.ws)
			this.ws.close();
		this.call_id = 0;
		this.ws = new WebSocket(this.options.url);
		this.ws.on('error', error => (console.error(error), this.close()));
		this.ws.on('close', () => setTimeout(this.connect.bind(this), 1000));
		this.ws.on('message', message => {
			try {
				const json = JSON.parse(message.toString());
				const [resolve, reject] = this.queue[json.id];
				json.error ? reject(json) : resolve(json);
			}
			catch (error) {
				console.error(error);
			}
		});
	}

	close() {
		this.connecting = false;
		this.ws && this.ws.close();
	}

	async call(method: string, params: any[] = []) {
		return new Promise((resolve, reject) => {
			const rpc = { jsonrpc: '2.0', id: this.call_id++, method, params };
			this.ws.send(JSON.stringify(rpc));
			this.queue[rpc.id] = [resolve, reject]; //TODO- watchdog
		});
	}

	async export_identity(identity: number) {
		return this.call('exportIdentity', [identity]);
	}

	async app_signin_with_identity(identity: number, app_domain: string) {
		return this.call('appSignInWithIdentity', [identity, app_domain]);
	}

	async request_sign_transaction(identity: number, transaction_hex: string) {
		return this.call('requestSignTransaction', [identity, transaction_hex]);
	}
}