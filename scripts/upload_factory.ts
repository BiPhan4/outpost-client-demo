import { Contract, getMnemonic } from "./helpers/utils";
import { connect } from "./helpers/connect";
import { wasmdConfig, archwayTestnetConfig, archwayMainnetConfig } from "./networks";
import { hitFaucet } from "./helpers/hitFaucet";
import { uploadContracts } from "./helpers/uploadContracts";
import { initToken } from "./helpers/initToken";
import { initOutpost } from "./helpers/initOutpost";
import { postFromCli } from "./helpers/postFromCli";

// WARNING: we recently used this to deploy on main net 
const contracts: Contract[] = [

  {
    name: "storage_outpost",
    wasmFile: "./contracts/storage_outpost.wasm",
  },
  {
    name: "outpost_factory",
    wasmFile: "./contracts/outpost_factory.wasm",
  },
];

async function main(): Promise<void> {
  

  const mnemonic = getMnemonic("ARCHTESTSEED");
  
  // get a signingclient
  const { client, address } = await connect(mnemonic, archwayMainnetConfig);

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
