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

export const malagaConfig: Network = {
  chainId: "localwasm-1",
  rpcEndpoint: "http://localhost:51441",
  prefix: "wasm",
  gasPrice: GasPrice.fromString("0.25uwsm"),
  feeToken: "uwsm",
  faucetUrl: "https://faucet.malaga-420.cosmwasm.com/",
};
