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
  chainId: "constantine-3",
  rpcEndpoint: "https://rpc.constantine.archway.io:443",
  prefix: "archway",
  gasPrice: GasPrice.fromString("1000000000000000aconst"),
  feeToken: "aconst",
  // Haven't set up a faucet URL for wasmd yet, we're just funding the account in the e2e environment
  faucetUrl: "https://faucet.malaga-420.cosmwasm.com/",
};
