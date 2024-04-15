import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Contract, loadContract } from "./utils";

interface UploadResults {
  [name: string]: number;
}

/**
 * 
 * @param client 
 * @param signer 
 * @param contracts 
 * @returns 
 */
export async function uploadContracts(
  client: SigningCosmWasmClient,
  signer: string,
  contracts: Contract[]
): Promise<UploadResults> {
  const uploaded: UploadResults = {};
  for (const contract of contracts) {
    const wasm = await loadContract(contract);
    console.debug(`Uploading ${contract.name}...`);
    const receipt = await client.upload(
      signer,
      wasm,
      {
        amount: [],
        gas: "20000000",
      },
      `Upload ${contract.name}`
    );
    console.debug(`We make it here?...`);


    uploaded[contract.name] = receipt.codeId;
  }
  return uploaded;
}
