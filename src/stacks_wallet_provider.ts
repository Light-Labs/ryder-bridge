/*
Possible messages:
{
	"jsonrpc": "2.0",
	"method": "exportIdentity",
	"params": [1],
	"id": 1
}
{
	"jsonrpc": "2.0",
	method: "appSignInWithIdentity",
	params: [0,"https://btc.us"],
	"id": 1
}
{
	"jsonrpc": "2.0"
	"method": "requestSignTransaction",
	"params": [unsignedTxHex],
	"id": 1
}
*/

export interface StacksWalletProviderRpcRequest {
	jsonrpc: '2.0';
	method: 'exportIdentity' | 'appSignInWithIdentity' | 'requestSignTransaction';
	params?: any[];
	id?: number;
}

interface StacksWalletProviderRpcResponseBase {
	jsonrpc: string;
	id: number;
}

interface StacksWalletProviderRpcResponseSuccess extends StacksWalletProviderRpcResponseBase {
	result: any;
}

interface StacksWalletProviderRpcResponseFailed extends StacksWalletProviderRpcResponseBase {
	error: { code: number, message: string, data?: any };
}

export type StacksWalletProviderRpcResponse = StacksWalletProviderRpcResponseSuccess | StacksWalletProviderRpcResponseFailed;
