import { Contract, getMnemonic } from "./helpers/utils";
import { connect } from "./helpers/connect";
import { wasmdConfig } from "./networks";
import { hitFaucet } from "./helpers/hitFaucet";
import { uploadContracts } from "./helpers/uploadContracts";
import { initToken } from "./helpers/initToken";
import { initOutpost } from "./helpers/initOutpost";
import { postKey } from "./helpers/postKey";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";


async function main(): Promise<void> {
  /**
   *  We're going to upload & initialise the contract here!
   *  Check out the video course on academy.cosmwasm.com!
   */

  // Get our mnemonic

  const mnemonic = getMnemonic();
  
  // get a signingclient
  const { client, address } = await connect(mnemonic, wasmdConfig);

  // check if given wallet has enough balance 
  const {amount} = await client.getBalance(address, wasmdConfig.feeToken); 

  // call a faucet 

  // if (amount === "0") {
  //   console.warn("Not enough tokens on given wallet. Calling faucet!")
  //   await hitFaucet(address, malagaConfig.feeToken, malagaConfig.faucetUrl);

  //   let { amount } = await client.getBalance(address, malagaConfig.feeToken);
  //   console.log(`New balance of ${address} is ${amount}!`);

  // }


  const contractAddress = "wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d"

  // when you restart the outpost e2e test, it will create a different jkl host address each time,
  // so we have to query for it.
  const queryClient = await CosmWasmClient.connect(wasmdConfig.rpcEndpoint)
  const queryMsg = { get_contract_state: {} };
  const result = await client.queryContractSmart(contractAddress, queryMsg);
  console.log(result.ica_info.ica_address)

  let loopCounter = 0;
  // Loop indefinitely
  while (true) {
    try {
      const tx = await postKey(client, address, contractAddress, result.ica_info.ica_address);
      console.log(tx);
    } catch (error) {
      console.error(`Error posting to ${contractAddress}:`, error);
    }

    loopCounter++; // Increment the loop counter

    // Introduce a delay to avoid spamming
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
  }
}

main().then(
  () => {
    process.exit(0);
  },
  (error) => {
    console.error(error);
    process.exit(1);
  }
);
