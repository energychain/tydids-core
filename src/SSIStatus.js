const ethers = require("ethers");

const env = require("./Env.js");

class SSIStatus {

    #identity = "";

    constructor(identity) {
        const secureElement = ethers.Wallet.createRandom();    
        this.provider = new ethers.providers.JsonRpcProvider(env._RPC_URL);        
        this.secureElement = secureElement.connect(this.provider); 
        this.#identity = identity;
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

module.exports = SSIStatus;