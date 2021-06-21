import WebSocket from 'ws';
import config, { Config } from "../config";
import { log } from './logger';
import { IncomingMessage } from 'http';
import EventEmitter from 'events';
import { RyderRpcHost } from './ryder';
import { AsyncRpcProvider, RpcRequest } from './asyncrpcprovider';


export class BridgeServer extends EventEmitter {
	protected rpc_provider: AsyncRpcProvider;
	protected wss!: WebSocket.Server;

	constructor(rpc_provider: AsyncRpcProvider) {
		super();
		this.rpc_provider = rpc_provider;
	}

	listen(config: Config) {
		this.wss = new WebSocket.Server({ host: config.host, port: config.port });
		this.emit('listening');
		this.wss.on('connection', this.handle_connection.bind(this));
	}

	protected handle_connection(client: WebSocket, request: IncomingMessage) {
		if (!['127.0.0.1', '::1'].includes(request.socket.remoteAddress!))
			return client.close(1);
		this.emit('connection', client);
		client.on('message', this.handle_message.bind(this));
	}

	protected handle_message(client: WebSocket, data: WebSocket.Data) {
		if (typeof data !== 'string')
			return;
		const request = JSON.parse(data) as RpcRequest; //TODO- handle invalid JSON.
		this.emit('message', request);
		this.rpc_provider.call(request).then(response => client.send(JSON.stringify(response)));
	}
}

const server = new BridgeServer(new AsyncRpcProvider(RyderRpcHost));
server.on('listening', () => log(`listening on ${config.host}:${config.port}`));
server.listen(config);
