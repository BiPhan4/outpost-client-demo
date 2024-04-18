import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { ChannelOpenInitOptions, InstantiateMsg } from "../../bindings/StorageOutpost.types";

export async function initOutpost(
    client: SigningCosmWasmClient,
    address: string,
    code: number
) {
    const channelOptions: ChannelOpenInitOptions = {
        connection_id: "connection-0",
        counterparty_connection_id: "connection-0",
        tx_encoding: "proto3"
    }
    const initMsg: InstantiateMsg = {
        admin: address,
        channel_open_init_options: channelOptions,

    };

    const info = await client.instantiate(
        address,
        code,
        initMsg,
        "what label do we need?",
        {
            amount: [],
            gas: "2000000",
        },
        {
            admin: address,
        }
    );
    return info.contractAddress
}