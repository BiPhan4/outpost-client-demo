import { Contract, getMnemonic } from "./helpers/utils";
import { connect } from "./helpers/connect";
import { wasmdConfig } from "./networks";
import { hitFaucet } from "./helpers/hitFaucet";
import { uploadContracts } from "./helpers/uploadContracts";
import { initToken } from "./helpers/initToken";
import { initOutpost } from "./helpers/initOutpost";
import { createOutpost } from "./helpers/createOutpost";
import { CosmWasmClient, Event } from "@cosmjs/cosmwasm-stargate";
import { postKey } from "./helpers/postKey";
import { ChannelOpenInitOptions, InstantiateMsg } from "../bindings/StorageOutpost.types";



import delay from 'delay';
import * as bip39 from 'bip39';

/*

WARNING: MUST READ

This file demonstrates using the outpost factory's transactions and queries. 

Before running 'yarn create_outpost'

you must run 'go test -v . -run TestWithFactoryClientTestSuite -testify.m TestOutpostFactoryClient -timeout 12h'

from within 'storage-outpost/e2e/interchaintest' 

and update 'rpcEndpoint' in wasmdConfig

NOTE: The address of the created storage outpost is retrieved from the 'wasm' event. See 'printWasmEventAttributes' and 'getOutpostAddress' below

*/

async function main(): Promise<void> {

  // Get our mnemonic for wasmd userA 

  const userAMnemonic = getMnemonic("MNEMONIC");
  
  // get a signingclient for userA
  const { client: clientA, address: addressA } = await connect(userAMnemonic, wasmdConfig);

  // check userA's balance
  const {amount} = await clientA.getBalance(addressA, wasmdConfig.feeToken); 

  // make a temporary userB
  const strength = 256; // 256 bits for 24 words
  const userBMnemonic = bip39.generateMnemonic(strength);
  // get a signingclient for userB
  const { client: clientB, address: addressB } = await connect(userBMnemonic, wasmdConfig);

  const coinToSend = {
    denom: "uwsm",
    amount: "100000000"
  }
  const coinForGas = {
    denom: "uwsm",
    amount: "1000000"
  }
  // send tokens from wasmd userA to userB
  clientA.sendTokens(
    addressA, 
    addressB,
    [coinToSend],
    { // fee 
      amount: [coinForGas],
      gas: "300000000",
    }, )
    
  const factoryContractAddress = "wasm1wug8sewp6cedgkmrmvhl3lf3tulagm9hnvy8p0rppz9yjw0g4wtqhs9hr8"

  // Wait for the bank send to finish
  console.log('Starting the sleep function');
  await sleep(3000); // Sleep for 3 seconds
  console.log('Finished sleeping for 3 seconds');

  let outpostAddress: string | undefined;

  // Make outpost for userB
  try {
    const tx = await createOutpost(clientB, addressB, factoryContractAddress);
    outpostAddress = getOutpostAddress(tx.events); // Assign the returned outpost address to the variable
  } catch (error) {
    console.error(`Error posting to ${factoryContractAddress}:`, error);
  }

  console.log(outpostAddress)

  // query to ensure that userB's outpost address and 
  // the address saved into their user_address<>outpost_address mapping inside the factory
  // are one and the same

  const queryClient = await CosmWasmClient.connect(wasmdConfig.rpcEndpoint)
  const queryMsg = { get_user_outpost_address: { user_address: addressB } };
  
  const outpostAddressFromQuery = await queryClient.queryContractSmart(factoryContractAddress, queryMsg);
  console.log(outpostAddressFromQuery)

  // check outpost works

  // Wait for the ica channel handshake to complete and the ica host address to be set 
  console.log('Starting the sleep function');
  await sleep(30000); // Sleep for 30 seconds
  console.log('Finished sleeping for 30 seconds');

  // Get userB's ica host address
  let jackalHostAddress: string | undefined;
  const outpostQueryMsg = { get_contract_state: {} };
  const outpostQueryResp = await queryClient.queryContractSmart(outpostAddress!, outpostQueryMsg);
  console.log(outpostQueryResp)
  jackalHostAddress = outpostQueryResp.ica_info.ica_address
  console.log(jackalHostAddress)

  let key: string = "testing the factory";

  const coin = {
    denom: "uwsm",
    amount: "10000000"
  }

  try {
    const tx = await postKey(clientB, addressB, outpostAddress!, jackalHostAddress!, key, coin);
    console.log(tx);
  } catch (error) {
    console.error(`Error posting to ${outpostAddress}:`, error);
  }

  // Confirmed via CLI that pubkey is saved on canine-chain

  // ***Instantiating Outpost Without Factory***
  
  // let's init the outpost directly to show that it has new optional owner and callback fields
  // callback can be ignored but owner should definitely be set 

  const channelOptions: ChannelOpenInitOptions = {
    connection_id: "connection-0",
    counterparty_connection_id: "connection-0",
    tx_encoding: "proto3"
  }

  const initMsg: InstantiateMsg = {
    // consider removing this admin field here, it really has no authority. 
    // This initMsg is just a jsonObject, but admin authority is actually set by 'clientB.instantiate' below
    // which calls the wasm.instantiate protobuf msg. 
    admin: addressB, 
    channel_open_init_options: channelOptions, 
    owner: addressB,
  };

  // need options:admin
  const info = await clientB.instantiate(
      addressB,
      1, // On devnet, codeID for storage outpost is always 1 because it's the first wasm file stored on chain
      initMsg,
      "storage outpost for userB",
      {
          amount: [coin],
          gas: "2000000",
      },
      {
          admin: addressB,
      }
  );
  // WARNING: Check against jackal.js 
  console.log(info.contractAddress);



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

// Define the sleep function with explicit type for 'ms'
function sleep(ms: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

interface EventAttribute {
  key: string;
  value: string;
}

interface MyEvent {
  type: string;
  attributes: readonly EventAttribute[];
}

// Update the function to accept a readonly array of Event from @cosmjs/stargate
function printWasmEventAttributes(events: readonly Event[]) {
  events.forEach((event) => {
    if (event.type === 'wasm') {
      console.log('Attributes of wasm event:', event.attributes);
      // If event.attributes are not directly loggable, map them for printing
      event.attributes.forEach(attr => {
        console.log(`${attr.key}: ${attr.value}`);
      });
    }
  });
}

// Function to find and return the 'outpost_address' from wasm events
function getOutpostAddress(events: readonly Event[]): string | undefined {
  for (const event of events) {
    if (event.type === 'wasm') {
      const addressAttr = event.attributes.find(attr => attr.key === 'outpost_address');
      if (addressAttr) {
        return addressAttr.value; // Return the outpost address immediately upon finding it
      }
    }
  }
  return undefined; // Return undefined if no 'outpost_address' is found
}