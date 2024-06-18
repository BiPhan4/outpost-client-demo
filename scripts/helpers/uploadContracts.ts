import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Contract, loadContract } from "./utils";
/**
 * WARNING: Not sure yet how to get a 100% accurate gas estimate for uploading the wasm file. 
 * The CLI command does a perfect job estimating:
 * 
 * archwayd tx wasm store storage_outpost.wasm \
  --gas auto \
  --gas-prices $(archwayd q rewards estimate-fees 1 \
    --node 'https://rpc.constantine.archway.io:443' \
    --output json | jq -r '.gas_unit_price | (.amount + .denom)') \
  --gas-adjustment 1.4 \
  --from bi \
  --chain-id constantine-3 \
  --node https://rpc.constantine.archway.io:443 \
  --broadcast-mode sync \
  --output json \
  -y
 * 
 * 
 */
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

    const coin = {
      denom: "aconst",
      amount: "700000000000000000"
    }

    const receipt = await client.upload(
      signer,
      wasm,
      {
        amount: [coin],
        gas: "4148421",
      },
      `Upload ${contract.name}`
    );
    console.debug(`We make it here?...`);


    uploaded[contract.name] = receipt.codeId;
  }
  return uploaded;
}
