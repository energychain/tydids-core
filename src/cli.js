#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

const fs = require("fs");
const { JSDOM } = require('jsdom');

const env = require("./Env.js");
const SSI = require("./SSI.js");
const ethers = require("ethers");

/**
 * Checks if the given identity is granted or revoked based on the blockchain data.
 *
 * @param {string} identity - The identity to check.
 * @return {Promise<void>} - Does not return anything. Exits the process with code 1 if the identity is revoked, 
 *                          or with code 0 if the identity is granted.
 */
async function isGranted(identity) {
  const provider = new ethers.providers.JsonRpcProvider(env._RPC_URL);
  const bn = (await provider.getBlockNumber()).toString() * 1;
  let sc = new ethers.Contract(env._revokeContract, env._revokeAbi, provider);      
  let rcp = await sc.revocations(identity);
  let ts =  rcp.toString() * 1;   
  console.log("isGranted("+identity+")@Consensus:"+bn); 
  if(ts > 0) {
    console.log("Revoked at "+new Date(ts*1000).toISOString());
    process.exit(1);
  } else {
    sc = new ethers.Contract(env._publishContract, env._publishAbi, provider);      
    rcp = await sc.publishs(identity);
    ts =  rcp.toString() * 1;    
    console.log("Granted at "+new Date(ts*1000).toISOString());
    process.exit(0);
  }
}


/**
 * Revokes a digital identity by reading the private key from a file, creating a new SSI instance,
 * revoking the identity, and logging the block number at which the revocation occurred.
 *
 * @param {string} filename - The path to the file containing the private key of the digital identity.
 * @return {Promise<void>} - A promise that resolves when the revocation is complete.
 * @throws {Error} - If there is an error reading the file or creating the SSI instance.
 */
async function revoke(filename) {
    try {
     const ssi_file = fs.readFileSync(filename);
     const dom = new JSDOM(ssi_file);     
     const scriptElement = dom.window.document.getElementById("ssiObject");
     const ssiObjectString = scriptElement.textContent;
     const ssiObject = JSON.parse(ssiObjectString);
     const ssi = new SSI(ssiObject.privateKey);
     const rcp = await ssi.revoke();
     const bn = (await ssi.provider.getBlockNumber()).toString() * 1;  
     console.log("revoke("+ssiObject.identity+")@Consensus:"+bn);      
     process.exit(0);     
    } catch(e) {
        console.error("Exception in revoke()");
        console.error(e);
    }
}

program
  .version('1.2.3', '-v, --version')
  .command('isgranted <identity>')
  .description('Checks if a data grant is revoked. Will have exit code 0 if in grant status or 1 if revoked.')
  .action((identity) => {
    isGranted(identity);    
  });
program.command('revoke <filename>')
  .description('Revokes a data grant using given ssi_*.html file.')
  .action((filename) => {
    revoke(filename);    
  });
program.parse(process.argv);