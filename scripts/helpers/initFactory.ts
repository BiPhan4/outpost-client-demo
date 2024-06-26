import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { ChannelOpenInitOptions, InstantiateMsg } from "../../bindings/OutpostFactory.types";

export async function initFactory(
    client: SigningCosmWasmClient,
    address: string,
    factoryCodeID: number
) {

    const initMsg: InstantiateMsg = {
        storage_outpost_code_id: 2980,
    };

    const coin = {
        denom: "aconst",
        amount: "280000000000000000"
      }

    // need options:admin
    const info = await client.instantiate(
        address,
        factoryCodeID,
        initMsg,
        "outpost factory",
        {
            amount: [coin],
            gas: "2000000",
        },
        {
            admin: address,
        }
    );
    return info.contractAddress
}