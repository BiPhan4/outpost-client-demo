import { Contract, getMnemonic } from "./helpers/utils";
import { connect } from "./helpers/connect";
import { wasmdConfig } from "./networks";
import { hitFaucet } from "./helpers/hitFaucet";
import { uploadContracts } from "./helpers/uploadContracts";
import { initToken } from "./helpers/initToken";
import { initOutpost } from "./helpers/initOutpost";

const contracts: Contract[] = [
  // {
  //   name: "cw20_base",
  //   wasmFile: "./contracts/cw20_base.wasm",
  // },
  {
    name: "storage_outpost",
    wasmFile: "./contracts/storage_outpost.wasm",
  },
];

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

  // upload the contract
  const codeId = await uploadContracts(client, address, contracts);

  console.log(codeId)

  // instantiate the contract
  const contractAddress = await initOutpost(client, address, codeId.storage_outpost)

  console.log(contractAddress);

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
