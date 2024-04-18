import { SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { ChannelOpenInitOptions, InstantiateMsg, ExecuteMsg } from "../../bindings/StorageOutpost.types";

export async function postFromCli(
    client: SigningCosmWasmClient,
    senderAddress: string,
    contractAddress: string,
    path: string,
) {

    // Declare an instance of send_cosmos_msgs_cli
    const sendCosmosMsgsCli: ExecuteMsg = {
        send_cosmos_msgs_cli: {
            path: path,
        }
    };

    const info = await client.execute(
        senderAddress,
        contractAddress,
        sendCosmosMsgsCli, //JsonObject
        { // fee 
            amount: [],
            gas: "3000000",
        },
        // no memo and no funds 
    );
    
    // Return only the transactionHash and events
    return {
        transactionHash: info.transactionHash,
        events: info.events
    };
}