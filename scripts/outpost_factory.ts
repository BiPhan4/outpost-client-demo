import { Contract, getMnemonic } from "./helpers/utils";
import { connect } from "./helpers/connect";
import { wasmdConfig } from "./networks";
import { hitFaucet } from "./helpers/hitFaucet";
import { uploadContracts } from "./helpers/uploadContracts";
import { initToken } from "./helpers/initToken";
import { initOutpost } from "./helpers/initOutpost";
import { createOutpost } from "./helpers/createOutpost";
import { CosmWasmClient, Event } from "@cosmjs/cosmwasm-stargate";

import delay from 'delay';
import * as bip39 from 'bip39';



async function main(): Promise<void> {
  /**
   *  We're going to upload & initialise the contract here!
   *  Check out the video course on academy.cosmwasm.com!
   */

  // Get our mnemonic for wasmd userA 

  const userAMnemonic = getMnemonic();
  
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
  await sleep(3000); // Sleep for 1 second
  console.log('Finished sleeping for 1 seconds');

  let outpostAddress: string | undefined;

  // Make outpost for userB
  try {
    const tx = await createOutpost(clientB, addressB, factoryContractAddress);
    outpostAddress = getOutpostAddress(tx.events); // Assign the returned outpost address to the variable
  } catch (error) {
    console.error(`Error posting to ${factoryContractAddress}:`, error);
  }

  console.log(outpostAddress)

  // query for map

  // check outpost works

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