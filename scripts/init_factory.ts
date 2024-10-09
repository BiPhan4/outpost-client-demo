import { Contract, getMnemonic } from "./helpers/utils";
import { connect } from "./helpers/connect";
import { wasmdConfig, archwayTestnetConfig, archwayMainnetConfig } from "./networks";
import { hitFaucet } from "./helpers/hitFaucet";
import { uploadContracts } from "./helpers/uploadContracts";
import { initToken } from "./helpers/initToken";
import { initFactory } from "./helpers/initFactory";
import { postFromCli } from "./helpers/postFromCli";

const contracts: Contract[] = [

  // {
  //   name: "storage_outpost",
  //   wasmFile: "./contracts/storage_outpost.wasm",
  // },
  // {
  //   name: "outpost_factory",
  //   wasmFile: "./contracts/outpost_factory.wasm",
  // },
];

async function main(): Promise<void> {
  

  const mnemonic = getMnemonic("ARCHTESTSEED");
  
  // get a signingclient
  const { client, address } = await connect(mnemonic, archwayMainnetConfig);

  // check if given wallet has enough balance 
  const {amount} = await client.getBalance(address, wasmdConfig.feeToken); 
  
  // instantiate the contract
  const contractAddress = await initFactory(client, address, 692)
  console.log(contractAddress)

  // returned this: 
  // archway1fdqdk2ck3hfzhx03qrx5arkhzz25qkz9x69utrmh2vxy85ur4f9spg5fcr

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
