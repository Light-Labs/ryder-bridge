export interface RpcRequest {
	jsonrpc: '2.0';
	method: string;
	params?: any[];
	id?: number;
}

interface RpcResponseBase {
	jsonrpc: string;
	id: number;
}

interface RpcResponseSuccess extends RpcResponseBase {
	result: any;
}

interface RpcResponseFailed extends RpcResponseBase {
	error: { code: number, message: string, data?: any };
}

type RpcResponse = RpcResponseSuccess | RpcResponseFailed;

export class AsyncRpcProvider {
	protected host;

	constructor(host: any) {
		this.host = host;
	}
	async call(request: RpcRequest): Promise<RpcResponse> {
		const { id, method, params } = request || {};
		if (!this.host.hasOwnProperty(method))
			return { jsonrpc: '2.0', id: id!, error: { code: 0, message: 'unknown method' } };
		try {
			const result = await this.host[method].apply(this.host, params || []);
			if (typeof result === 'object' && result.error)
				return { jsonrpc: '2.0', id: id!, error: result.error };
			return { jsonrpc: '2.0', id: id!, result };
		}
		catch (error) {
			return { jsonrpc: '2.0', id: id!, error: { code: 1, message: 'runtime error occurred', data: error } };
		}
	}

}