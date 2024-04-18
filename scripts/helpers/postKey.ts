import { SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { ChannelOpenInitOptions, InstantiateMsg, ExecuteMsg, CosmosMsgForEmpty } from "../../bindings/StorageOutpost.types";
import { Pubkey } from '@jackallabs/jackal.nodejs-protos'; 

export async function postKey(
    client: SigningCosmWasmClient,
    senderAddress: string,
    contractAddress: string,
    icaHostAddress: string,
) {

    // Declare an instance of Pubkey msg 
    const pubkeyInstance: Pubkey = {
        address: icaHostAddress,
        key: "hey it's Bi coming at you from Typescript with Love! <3"
    };
    
    // Encode the msg to Protobuf wire format
    const writer = Pubkey.encode(pubkeyInstance);
    const encodedBytes = writer.finish(); // Uint8Array

    // Base64 Encoded
    const base64Encoded = Buffer.from(encodedBytes).toString('base64');

    // NOTE: there must be a function in the JS protobuf library that can return the typeURL of any msg?
    // Hard coding it for demo purposes only
    const stargateMsg: CosmosMsgForEmpty = {
        stargate: {
            type_url: "/canine_chain.filetree.MsgPostKey",
            value: base64Encoded,
        }
    }

    // Declare an instance of send_cosmos_msgs
    const sendCosmosMsgsToExecute: ExecuteMsg = {
        send_cosmos_msgs: {
            messages: [stargateMsg],
            // below is optional
            // packet_memo: "Example memo for the packet",
            // timeout_seconds: 3600
        }
    };

    const info = await client.execute(
        senderAddress,
        contractAddress,
        sendCosmosMsgsToExecute, 
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