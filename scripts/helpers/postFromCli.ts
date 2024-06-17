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
    
    // Find the 'wasm-logging' event
    const wasmLoggingEvent = info.events.find(event => event.type === 'wasm-logging');

    // Extract and log the attributes of the 'wasm-logging' event
    if (wasmLoggingEvent) {
        console.log("WASM Logging Attributes:", wasmLoggingEvent.attributes);
        return {
            transactionHash: info.transactionHash,
            wasmLoggingAttributes: wasmLoggingEvent.attributes
        };
    } else {
        console.log("No WASM Logging Event Found.");
        return {
            transactionHash: info.transactionHash,
            wasmLoggingAttributes: []
        };
    }
}
