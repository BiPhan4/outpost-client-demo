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
  rpcEndpoint: "http://localhost:60982",
  prefix: "wasm",
  gasPrice: GasPrice.fromString("0.25uwsm"),
  feeToken: "uwsm",
  // Haven't set up a faucet URL for wasmd yet, we're just funding the account in the e2e environment
  faucetUrl: "https://faucet.malaga-420.cosmwasm.com/",
};
