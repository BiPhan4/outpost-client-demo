import { Contract, getMnemonic } from "./helpers/utils";
import { connect } from "./helpers/connect";
import { wasmdConfig, archwayTestnetConfig, archwayMainnetConfig, jklTestnetConfig } from "./networks";
import { hitFaucet } from "./helpers/hitFaucet";
import { uploadContracts } from "./helpers/uploadContracts";
import { initToken } from "./helpers/initToken";
import { initOutpost } from "./helpers/initOutpost";
import { postFromCli } from "./helpers/postFromCli";

// WARNING: we recently used this to deploy on main net 
const contracts: Contract[] = [

  // {
  //   name: "filetree",
  //   wasmFile: "./contracts/filetree.wasm",
  // },
  {
    name: "bindings_factory",
    wasmFile: "./contracts/bindings_factory.wasm",
  },
];

async function main(): Promise<void> {
  

  const mnemonic = getMnemonic("JKLTESTSEED");
  
  // get a signingclient
  const { client, address } = await connect(mnemonic, jklTestnetConfig);

  // check if given wallet has enough balance 
  const {amount} = await client.getBalance(address, wasmdConfig.feeToken); 

  console.log(amount)

  // // upload the outpost and outpost_factory wasm modules
  const codeIds = await uploadContracts(client, address, contracts);

  console.log(codeIds)

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
