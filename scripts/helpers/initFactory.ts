import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { ChannelOpenInitOptions, InstantiateMsg } from "../../bindings/OutpostFactory.types";

export async function initFactory(
    client: SigningCosmWasmClient,
    address: string,
    factoryCodeID: number
) {

    const initMsg: InstantiateMsg = {
        bindings_code_id: 5,
    };

    const coin = {
        denom: "ujkl",
        amount: "10000000"
      }

    // need options:admin
    const info = await client.instantiate(
        address,
        factoryCodeID,
        initMsg,
        "bindings factory",
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