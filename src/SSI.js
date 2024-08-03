/**
 * This class provides a mechanism for creating, managing, and verifying digital identities on a blockchain. 
 * It leverages a secure element to generate cryptographic keys and sign data, ensuring the authenticity and integrity of the created identity.
 * 
 * Key Features:
 *  - Identity Generation: Creates a new, random identity with a corresponding private key on a secure element.
 *  - Payload Signing: Signs arbitrary payloads with the private key associated with the identity.
 *  - Identity Publication: Publishes the identity on a blockchain using a smart contract.
 *  - Identity Verification: Verifies the publication status of an identity.
 *  - Identity Revocation: Revokes a previously published identity via a smart contract.
 *  - Identity Disclosure: Reveals the identity, private key, signature, and payload.
 *  
 * Use Cases:
 *  - Self-Sovereign Identity (SSI): The class can be used to create and manage decentralized identities that are independent of central authorities.
 *  - Authentication: The identity can serve as the foundation for an authentication system, for example, to access resources or services.
 *  - Data Integrity: The signature of the payload can be used to ensure the integrity of data.
 *  - Non-repudiation: The published identity can serve as proof of the creation of a specific data signature.
 */

const ethers = require("ethers");

const env = require("./Env.js");

class SSI {

    #identity = "";

    constructor(privateKey) {
        const secureElement = new ethers.Wallet(privateKey);    
        this.provider = new ethers.providers.JsonRpcProvider(env._RPC_URL);        
        this.secureElement = secureElement.connect(this.provider); 
        this.#identity = secureElement.address;
    }

     /**
     * Announces the existence validation by calling the `publish` function of the `Contract` object.
     *
     * @return {Promise<ethers.providers.TransactionReceipt>} A promise that resolves to the transaction receipt of the publish transaction.
     */
     async publish() {                
        const sc = new ethers.Contract(env._publishContract, env._publishAbi, this.secureElement);      
        const rcp = await sc.publish();
        const receipt = await rcp.wait();
        return receipt;
    }

    /**
     * Checks if Identity is published by calling the `publishs` function of the `Contract` object.
     *
     * @return {Promise<any>} A promise that resolves to the result of the `publishs` function with time stamp of publishing or 0
     */
    async isPublishedAt() {                        
        const sc = new ethers.Contract(env._publishContract, env._publishAbi, this.secureElement);      
        const rcp = await sc.publishs(this.#identity);
        return rcp.toString() * 1;    
    }

    /**
     * Asynchronously revokes this validation by calling the `revoke` function on the contract instance
     * and waiting for the transaction to be mined. Returns the transaction receipt.
     *
     * @return {Promise<object>} The transaction receipt object.
     */
    async revoke() {
            const sc = new ethers.Contract(env._revokeContract, env._revokeAbi, this.secureElement);      
            const rcp = await sc.revoke();
            const receipt = await rcp.wait();
            return receipt;
    }

    /**
     * Asynchronously checks if identity is revoked by calling the `revocations` function on the contract instance
     * and waiting for the result. Returns the result as a time of revocation or 0.
     *
     * @return {Promise<number>} Returns revocation timestamp or 0 if not revoked.
     */
    async isRevokedAt() {
            const sc = new ethers.Contract(env._revokeContract, env._revokeAbi, this.secureElement);      
            const rcp = await sc.revocations(this.#identity);
            return rcp.toString() * 1;    
    }

    /**
     * Returns the identity of the object.
     *
     * @return {any} The identity of the object.
     */
    getIdentity() {
        return this.#identity;
    }
    



    
}

module.exports = SSI;