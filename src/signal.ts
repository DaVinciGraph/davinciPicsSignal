type DPSignalTokenTypes = "TOKEN" | "LP" | "WRAPPED";

type DPSignalBaseTokenArgs = {
	address: string;
	network: string;
};

type DPSignalBaseArgs = {
	type: DPSignalTokenTypes;
	address: string;
	network: string;
	title: string;
};

type DPSignalForeignToken = DPSignalBaseArgs & {
	type: "TOKEN";
	network: Omit<string, "hedera">;
};

type DPSignalLPToken = DPSignalBaseArgs & {
	type: "LP";
	token0: DPSignalBaseTokenArgs;
	token1: DPSignalBaseTokenArgs;
};

type DPSignalWrappedToken = DPSignalBaseArgs & {
	type: "WRAPPED";
	originalToken: DPSignalBaseTokenArgs;
};

type DPSignalArgs = DPSignalForeignToken | DPSignalLPToken | DPSignalWrappedToken;

// put your application api key here
const DavinciPicsApiKey = `___YOUR_API_KEY___`;
const DavinciPicsApiUrl = `https://davincigraph.art/api/v1/tokens`;

/**
 * send all three types of signals through
 * please notice that you should only signal tokens orginated by your app
 * example1: (adding a foreign token) {type: "TOKEN", network: "Binance", address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", title: "cake"}
 * example2: (adding a foreign currency) {type: "TOKEN", network: "Ethereum", address: "ETH", title: "Ethereum"} // this is unnecessary since the currencies are already added
 * example3: (wrapping of token from another network) {type: "WRAPPED", network: "hedera", address: "0.0.1302527", title: "Wrapped Cake", originalToken: {network: "binance", address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"}}
 * example4: (wrapping of a currency from the same network) {type: "WRAPPED", network: "Ethereum", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", title: "Wrapped ETH", originalToken: {network: "Ethereum", address: "ETH"}}
 * example5: (liquidity) {type: "LP", network: "hedera", address: "0.0.1080216", title: "USDC - HBAR", token0: {network: "hedera", address: "0.0.456858"}, token1: {network: "hedera", address: "0.0.1062664"}}
 * @param args
 */
export const signalDavinciPics = async <T extends DPSignalTokenTypes>(
	args: T extends "TOKEN" ? DPSignalForeignToken : T extends "LP" ? DPSignalLPToken : T extends "WRAPPED" ? DPSignalWrappedToken : never
) => {
	try {
		switch (args.type) {
			case "TOKEN":
				await signalForeignToken(args);
				break;
			case "WRAPPED":
				await signalWrappedToken(args);
				break;
			case "LP":
				await signalLiquidityToken(args);
				break;
		}
	} catch (error: any) {
		console.error(`DavinciPicsSignal Error: ${error.message}`);
	}
};

/**
 * signal a non-hedera-based non-complex token
 * example1: (adding a token) {network: "Binance", address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", title: "cake"}
 * example2: (adding a currency) {network: "Ethereum", address: "ETH", title: "Ethereum"} // this is unnecessary since the currencies are already added
 * @param args {DPSignalForeignToken}
 */
export const signalForeignToken = async ({ network, address, title }: DPSignalForeignToken) => {
	if (network.toLowerCase() === "hedera") {
		throw new Error("Apps are not allowed to add common hedera tokens, only LP or WRAPPED");
	}

	try {
		await singalRequest(network, address, { type: "TOKEN", title });
	} catch (error: any) {
		console.error(`DavinciPics Error: ${error.message}`);
	}
};

/**
 * signal a wrapped token
 * example1:(wrapping of token from another network) {network: "hedera", address: "0.0.1302527", title: "Wrapped Cake", originalToken: {network: "binance", address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"}}
 * example2:(wrapping of a currency from the same network) {network: "Ethereum", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", title: "Wrapped ETH", originalToken: {network: "Ethereum", address: "ETH"}}
 * @param args {DPSignalWrappedToken}
 */
export const signalWrappedToken = async ({ network, address, originalToken, title }: DPSignalWrappedToken) => {
	try {
		await singalRequest(network, address, { type: "WRAPPED", originalToken, title });
	} catch (error: any) {
		console.error(`DavinciPics Error: ${error.message}`);
	}
};

/**
 * signal a liquidity token
 * example: {network: "hedera", address: "0.0.1080216", title: "USDC - HBAR", token0: {network: "hedera", address: "0.0.456858"}, token1: {network: "hedera", address: "0.0.1062664"}}
 * @param args {DPSignalLPToken}
 */
export const signalLiquidityToken = async ({ network, address, token0, token1, title }: DPSignalLPToken) => {
	try {
		await singalRequest(network, address, { type: "LP", token0, token1, title });
	} catch (error: any) {
		console.error(`DavinciPics Error: ${error.message}`);
	}
};

const singalRequest = async <T extends Omit<DPSignalArgs, "address" | "network">>(network: string, address: string, values: T) => {
	const response = await fetch(`${DavinciPicsApiUrl}/${network}/${address}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": DavinciPicsApiKey,
		},
		body: JSON.stringify(values),
	});

	if (response.status === 200 || response.status === 201) {
		console.log(`${values.type} was successfully sent to DavinciPics.`);
	}
};
