// data from https://github.com/cosmos/chain-registry/tree/master/testnets
import { GasPrice } from "@cosmjs/stargate";

export interface Network {
  chainId: string;
  rpcEndpoint: string;
  prefix: string;
  gasPrice: GasPrice;
  feeToken: string;
  faucetUrl: string;
}

export const wasmdConfig: Network = {
  chainId: "localwasm-1",
  rpcEndpoint: "http://localhost:54034",
  prefix: "wasm",
  gasPrice: GasPrice.fromString("0.25uwsm"),
  feeToken: "uwsm",
  // Haven't set up a faucet URL for wasmd yet, we're just funding the account in the e2e environment
  faucetUrl: "https://faucet.malaga-420.cosmwasm.com/",
};

export const archwayTestnetConfig: Network = {
  chainId: "constantine-3",
  rpcEndpoint: "http://172.233.221.58:26657", // This is our personal RPC 
  prefix: "archway",
  gasPrice: GasPrice.fromString("1000000000000000aconst"),
  feeToken: "aconst",
  // TODO: set up faucet
  faucetUrl: "",
};

export const archwayMainnetConfig: Network = {
  chainId: "archway-1",
  rpcEndpoint: "https://rpc.mainnet.archway.io:443", // This is our personal RPC 
  prefix: "archway",
  gasPrice: GasPrice.fromString("1000000000000000aarch"),
  feeToken: "aarch",
  // TODO: set up faucet
  faucetUrl: "",
};

// https://rpc.mainnet.archway.io
// https://rpc.mainnet.archway.io:443