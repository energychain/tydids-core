/**
 * This class provides a decentralized identity management system, enabling the creation,
 * verification, and revocation of digital identities on a blockchain.
 * Key Features:
 * - Identity Generation: Creates a new, random identity with a corresponding private key.
 * - Payload Signing: Signs arbitrary payloads with the associated private key.
 * - Identity Publication: Publishes the identity on a blockchain using a smart contract.
 * - Identity Verification: Verifies the publication status of an identity.
 * - Identity Revocation: Revokes a previously published identity via a smart contract.
 * 
 * Use Cases:
 * Self-Sovereign Identity (SSI): The class can be used to create and manage decentralized 
 * identities that are independent of central authorities. 
 * 
 * Example Usage:
 * - When a webpage visitor confirms GDPR compliance, a new instance of this class should be 
 *   created with the data from already filled form fields as payload: 
 *   `new DecentralizedIdentityConsent({ ... form fields })`.
 * - The user's browser calls the "reveal" method which could trigger the download of an 
 *   HTML containing the SSI to their device.
 * - Using this SSI, the user is able to revoke the granted data later.
 * - Finally, the form gets submitted with new fields retrievable using the `consensus()`  
 *   method of the instance. This contains the identity, payload, and signature by the SSI.
 * - Further on, the data might be stored on any backend ensuring that the identity given 
 *   stays attached to the user's data.
 */

const ethers = require("ethers"); // Handles most of the decentrilized identity methods

const env = require("./Env.js"); // Defines an environment (esp. DLT access/usage).

class DecentralizedIdentityConsent {
    #payload = "";  // Typically the form fields or an external id to define the scope. 
    #signature = ""; // Signature of payload by the identity of the SSI
    #identity = ""; // Actual Identity of the SSI
    #privateKey = ""; // The private key of the SSI

    /**
     * Constructs a new instance. This is an SSI in its intermediate state before reveal() is called.
     * @param {*} payload  user given data the consent is based on (scope) or external ID
     */
    constructor(payload) {
        if(typeof payload == 'object') payload = JSON.stringify(payload);
        if(!isNaN(payload)) payload = "" + payload;
        this.#payload = payload;
        this.#initSecureElement();
    }

   /**
    * Initializes the secure element, which is a cryptographic environment that protects 
    * the data by signing it with an individually created SSI (Self-Sovereign Identity) 
    * for this set of payload data.
    *
    * This method creates a new random wallet using the ethers.js library, sets the 
    * identity to the wallet's address, creates a new provider using the RPC URL defined 
    * in the environment variables, connects the wallet to the provider, and sets the 
    * private key to the wallet's private key.
    */
    #initSecureElement() {
        this.secureElement = ethers.Wallet.createRandom();        
        this.#identity = this.secureElement.address;        
        this.provider = new ethers.providers.JsonRpcProvider(env._RPC_URL);        
        this.secureElement = this.secureElement.connect(this.provider);       
        this.#privateKey = this.secureElement.privateKey;
    }

    /**
     * The consensus() method is an asynchronous function that generates 
     * a consensus by signing the payload if it hasn't been signed yet. 
     * The consensus consists of three parts:
     * - Payload (the original data, eq. form data by user)
     * - Signature (a digital signature generated using the secure element's signMessage() method)
     * - Identity (an identifier associated with the user)
     *
     * @return {Promise<Object>} An object containing the payload, signature, and identity.
     */
    async consensus() {
        if(this.#signature.length == 0) {
            this.#signature = await this.secureElement.signMessage(this.#payload);
        }
        return {
            payload: this.#payload,
            signature: this.#signature,
            identity: this.#identity
        }
    }

    /**
     * Publishes the existence of the Data Identity, announcing its presence on a DLT.     
     * By publicly declaring the ID's existence without revealing sensitive 
     * information or identifying the data provider, this method enables both parties to 
     * prove the timestamp of the event. 
     * This is crucial for resolving disputes in cases like GDPR violations.
     * @link https://github.com/energychain/tydids-core/wiki/DevFAQ-%E2%80%90-DecentralizedIdentityConsent#how-does-the-publish-method-ensure-that-sensitive-information-remains-anonymous
     * @return {Promise<ethers.providers.TransactionReceipt>} A promise that resolves to the transaction receipt of the publish transaction.
     */
     async publish() {                
        const sc = new ethers.Contract(env._publishContract, env._publishAbi, this.secureElement);      
        const rcp = await sc.publish();
        const receipt = await rcp.wait();
        return receipt;
    }

   /**
    * Verifies if the Data Identity has been published on the DLT.
    *
    * This method calls the `publishs` function of the smart contract, which checks for the existence 
    * of the identity and returns its timestamp (if found) or 0 (if not).
    *
    * @return {Promise<number>} A promise that resolves to the timestamp of publication (or 0 if unpublished)
    */
    async isPublishedAt() {                        
        const sc = new ethers.Contract(env._publishContract, env._publishAbi, this.secureElement);      
        const rcp = await sc.publishs(this.#identity);
        return rcp.toString() * 1;    
    }

    /**
     * Returns the identity (identifier) of the object.
     *
     * @return {any} The identity of the object.
     */
    getIdentity() {
        return this.#identity;
    }

   /**
    * Revokes the current consent by calling the `revoke` function on a smart contract and waiting for transaction confirmation.
    *
    * This method asynchronously revokes the consent, ensuring that the operation is persisted on the blockchain. 
    * It returns the transaction receipt object once confirmed.
    *
    * @return {Promise<object>} The transaction receipt containing details about the revoked validation
    */
    async revoke() {
        const sc = new ethers.Contract(env._revokeContract, env._revokeAbi, this.secureElement);      
        const rcp = await sc.revoke();
        const receipt = await rcp.wait();
        return receipt;
    }

   /**
    * Asynchronously checks if the identity is revoked by querying a smart contract.
    *
    * This method calls the `revocations` function on the contract instance and waits for the result, 
    * returning the revocation timestamp (if revoked) or 0 (if not).
    * @return {Promise<number>} Returns revocation timestamp or 0 if not revoked.
    */
    async isRevokedAt() {
        const sc = new ethers.Contract(env._revokeContract, env._revokeAbi, this.secureElement);      
        const rcp = await sc.revocations(this.#identity);
        return rcp.toString() * 1;    
    }
 
   /**
    * Initializes the SSI (Self-Sovereign Identity) and generates a new identity, signature, and payload.
    *
    * This method should only be called once by the data provider as it resets the secure element and 
    * generates fresh cryptographic materials. It ensures that accidental multiple SSIs for the same 
    * data sharing/providing event are prevented.
    *
    * @return {Promise<Object>} An object containing the private key, identity, signature, and payload.
    */
    async reveal () {   
        await this.consensus();     
        const response = {
            privateKey: ""+this.#privateKey,
            identity: ""+this.#identity,
            signature: ""+this.#signature,
            payload: ""+this.#payload
        }        
        this.#signature = "";
        this.#initSecureElement();        
        await this.consensus();
        return response;        
    }
}
module.exports = DecentralizedIdentityConsent;