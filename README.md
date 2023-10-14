# Introduction

`DavinciPicsSignal` is a handy function that dapps on the Hedera network can use to communicate with the `DavinciPics` API. It tells `DavinciPics` when a new special type of token, like a wrapped token or a Liquidity Provider (LP) token, has been created in the dapp, or a token on another network's logo is needed to be add on Hedera.

## What Does It Do?

**Informs About Wrapped Tokens:** If a dapp, like Hashport, creates a wrapped token based on a token from another network, like USDC on Ethereum, `DavinciPicsSignal` informs `DavinciPics` about it.

**Shares LP Token Info:** When a dapp, such as Saucerswap, makes a new LP token, `DavinciPicsSignal` tells `DavinciPics` which two tokens make up that LP token.

**Informs About Missing Foreign Tokens:** Sometimes, logos for tokens from other networks like Ethereum aren't initially needed on Hedera. But when these tokens become part of wrapped tokens on Hedera, their logos become important. In these cases, apps can use `DavinciPicsSignal` to let `DavinciPics` know that a missing foreign token logo is now needed. The logos for these tokens will be added by `DavinciPics` Administration in matter of minutes.

## What It Doesn't Do?

`DavinciPicsSignal` doesn't upload logos for your app tokens. Its main job is to tell `DavinciPics` when you've created a special kind of token in your app. This way, `DavinciPics` can link your new token to its original version and show the right logos.

## Why Is This Useful?

`DavinciPics` is about to be known for providing Hedera token logos and other token-related images. When you create these special tokens in your Hedera app, using `DavinciPicsSignal` ensures that `DavinciPics` knows about your new tokens and can display their correct logos, origin apps, and original networks.

# Installation

### TypeScript

Clone the repository and copy the `src/signal.ts` file to your project.

### Javascript

Clone the repository, execute `npm run build:es` command, and copy the `dist/signal.js` file to your project.

> **Don't forget to set your API key. If you don't have one, you can contact us via our Discord server.**

# Usage

Demonstrating how to signal different kind of tokens to DavinciPics:

## Singal a wrapped token

Adding a Hedera wrapped token from a foreign network

```Javascript
await signalDavinciPics({
	type: "WRAPPED",
	network: "hedera",
	address: "0.0.1302527",
	title: "Wrapped Cake or WCAKE",
	originalToken: {
		network: "binance",
		address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"
	}
});
```

Adding a pure Hedera wrapped token

```Javascript
await signalDavinciPics({
	type: "WRAPPED",
	network: "hedera",
	address: "0.0.1302527",
	title: "Wrapped HBAR or WHBAR",
	originalToken: {
		network: "hedera",
		address: "hbar"
	}
});
```

Adding a pure foreign wrapped token (needed in case of Bridges like Hashport)

```Javascript
await signalDavinciPics({
	type: "WRAPPED",
	network: "Ethereum",
	address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
	title: "Wrapped ETH or WTH",
	originalToken: {
		network: "Ethereum",
		address: "ETH"
	}
});
```

## Signal an LP Token

Adding an LP token

```Javascript
await signalDavinciPics({
	network: "hedera",
	address: "0.0.1080216",
	title: "USDC - HBAR",
	token0: {
		network: "hedera",
		address: "0.0.456858"
	},
	token1: {
		network: "hedera",
		address: "0.0.1062664"
	}
});
```

In the above example though both of the tokens in the pair are wrapped, DavinciPic knows how to show their logos.

## Signal a Foreign Token

This is to inform DavinciPics about a token which is not complex but it's from another network. Like consider the case when `Cake` (which is originally a `Binance` Token) logo is missing. Dapps can inform DavinciPics that the logo of it is needed on Hedera.

```Javascript
await signalDavinciPics({
	network: "Binance",
	address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
	title: "cake"
})
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
