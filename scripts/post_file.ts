import { Contract, getMnemonic } from "./helpers/utils";
import { connect } from "./helpers/connect";
import { wasmdConfig } from "./networks";
import { hitFaucet } from "./helpers/hitFaucet";
import { uploadContracts } from "./helpers/uploadContracts";
import { initToken } from "./helpers/initToken";
import { initOutpost } from "./helpers/initOutpost";
import { postFromCli } from "./helpers/postFromCli";

async function main(): Promise<void> {
  /**
   *  We're going to upload & initialise the contract here!
   *  Check out the video course on academy.cosmwasm.com!
   */

  // Get our mnemonic

  const mnemonic = getMnemonic("MNEMONIC");
  
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

  // Each user has their own instance of a contract, and we're going to use the contract
  // that's instantiated in the outpost e2e tests.
  // This contract's ica host already has a 's' root directory, so we can freely make children of s 
  const contractAddress = "wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d"
  let loopCounter = 0;

  // Loop indefinitely
  while (true) {
    try {
      const memePath = `s/Memes${loopCounter}`;
      const tx = await postFromCli(client, address, contractAddress, memePath);
      console.log(`Transaction for ${memePath} sent successfully.`);
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
