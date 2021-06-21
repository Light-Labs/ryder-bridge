import RyderSerial, { Options } from "@lightlabs/ryderserial-proto";

async function ryder_session() {
	//TODO- Waits until the serial port is available and then opens a ryderserial session. Might need some sort of mutex.
	//		Also, we do not want to keep the port open (thus blocking other applications from accessing the Ryder).
	return {};
}

export const RyderRpcHost = {
	exportIdentity: async function (identity: number) {
		if (typeof identity !== 'number')
			throw new Error('ArgumentError');
		const ryder = await ryder_session() as RyderSerial;
		const result = await ryder.send([RyderSerial.COMMAND_EXPORT_PUBLIC_IDENTITY, identity]);
		ryder.close();
		return result;
	},

	appSignInWithIdentity: async function (identity: number, app_domain: string) {
		if (typeof identity !== 'number' || !app_domain)
			throw new Error('ArgumentError');
		const ryder = await ryder_session() as RyderSerial;
		const result = await ryder.sequence(async () => {
			const result = await ryder.send([RyderSerial.COMMAND_EXPORT_OWNER_APP_KEY_PRIVATE_KEY, identity]);
			if (result !== RyderSerial.RESPONSE_SEND_INPUT) {
				ryder.close();
				throw new Error('Expected to send input'); //TODO- better error response
			}
			const response = await ryder.send(app_domain + "\0");
			return (response === RyderSerial.RESPONSE_REJECTED) ? false : response;
		});
		ryder.close();
		return result;
	},

	requestSignTransaction: async function (identity: number, transaction_hex: string) {
		//TODO-
	}
};
