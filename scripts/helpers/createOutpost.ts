import { SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { ExecuteMsg, ChannelOpenInitOptions } from "../../bindings/OutpostFactory.types";
import { Pubkey } from '@jackallabs/jackal.nodejs-protos'; 
import { Coin } from "@cosmjs/amino";



export async function createOutpost(
    client: SigningCosmWasmClient,
    senderAddress: string,
    contractAddress: string, // The factory's address 
) {

    const channelOptions: ChannelOpenInitOptions = {
        connection_id: "connection-0",
        counterparty_connection_id: "connection-0",
        tx_encoding: "proto3"
    }

    // Declare an instance of creat
    const createOutpostMsg: ExecuteMsg = {
        create_outpost: {
            channel_open_init_options: channelOptions,
            // below is optional
            // packet_memo: "Example memo for the packet",
            // timeout_seconds: 3600
        }
    };

    const coin = {
        denom: "uwsm",
        amount: "1000000"
    }

    const info = await client.execute(
        senderAddress,
        contractAddress,
        createOutpostMsg, 
        { // fee 
            amount: [coin],
            gas: "300000000",
        },
        // no memo and no funds 
    );
    
    // Return only the transactionHash and events
    return {
        transactionHash: info.transactionHash,
        events: info.events
    };
}