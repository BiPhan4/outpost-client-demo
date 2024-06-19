import { Contract, getMnemonic } from "./helpers/utils";
import { connect } from "./helpers/connect";
import { wasmdConfig, archwayTestnetConfig } from "./networks";
import { hitFaucet } from "./helpers/hitFaucet";
import { uploadContracts } from "./helpers/uploadContracts";
import { initToken } from "./helpers/initToken";
import { initFactory } from "./helpers/initFactory";
import { postFromCli } from "./helpers/postFromCli";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { postKey } from "./helpers/postKey";
import { SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { ExecuteMsg, ChannelOpenInitOptions } from "../bindings/OutpostFactory.types";
import { Pubkey } from '@jackallabs/jackal.nodejs-protos'; 
import { Coin } from "@cosmjs/amino";

// WARNING: This is fairly expensive
// Script for creating an outpost on Archway's testnet

async function main(): Promise<void> {
  

  const mnemonic = getMnemonic("ARCHTESTSEED");
  
  // get a signingclient
  const { client, address } = await connect(mnemonic, archwayTestnetConfig);

  // check if given wallet has enough balance 
  const {amount} = await client.getBalance(address, wasmdConfig.feeToken); 

  // factory address: 
  // archway1fdqdk2ck3hfzhx03qrx5arkhzz25qkz9x69utrmh2vxy85ur4f9spg5fcr

  let archFactoryAddress: string = "archway1fdqdk2ck3hfzhx03qrx5arkhzz25qkz9x69utrmh2vxy85ur4f9spg5fcr";

  // Make outpost 
  try {
    const tx = await createOutpost(client, address, archFactoryAddress);
    console.log(tx.transactionHash)
  } catch (error) {
    console.error(`Error posting to ${archFactoryAddress}:`, error);
  }

  // Already made this outpost address:
  // archway1w9h6x3fk435ayydpg43jffm75lqurvgdr7p5vhrzg9va7rf5fpgswwhpnd
  // * got the address from a block explorer


  // // check outpost works
  let outpostAddress: string = "archway1w9h6x3fk435ayydpg43jffm75lqurvgdr7p5vhrzg9va7rf5fpgswwhpnd";
  let jackalHostAddress: string = "jkl14y5gpqpray5xgpjywrup3zvglxexgl9cgg5w0946zszl7mgx2kgqk0c69h";
  // * got this from block explorer

  const coin = {
    denom: "aconst",
    amount: "280000000000000000"
  }

  let key: string = "sailing through arches"

  try {
    const tx = await postKey(client, address, outpostAddress, jackalHostAddress, key, coin);
    console.log(tx);
  } catch (error) {
    console.error(`Error posting to ${outpostAddress}:`, error);
  }

  // Can confirm via CLI thaft pubkey is saved on canine-chain

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

export async function createOutpost(
  client: SigningCosmWasmClient,
  senderAddress: string,
  contractAddress: string, // The factory's address 
) {

  const channelOptions: ChannelOpenInitOptions = {
      connection_id: "connection-119",
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
    denom: "aconst",
    amount: "280000000000000000"
  }

  const info = await client.execute(
      senderAddress,
      contractAddress,
      createOutpostMsg, 
      { // fee 
          amount: [coin],
          gas: "2000000",
      },
      // no memo and no funds 
  );
  
  // Return only the transactionHash and events
  return {
      transactionHash: info.transactionHash,
      events: info.events
  };
}

