// npm i @neynar/nodejs-sdk
import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { config } from '../environments/prod';

// make sure to set your NEYNAR_API_KEY .env
// don't have an API key yet? get one at neynar.com
const client = new NeynarAPIClient(config.neynar);

async function main() {
  const addr = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045';
  const user = await client.lookupUserByUsername('adam-unchained');
  console.log(user);
  console.log(user.result.user.verifiedAddresses);
}

main();
