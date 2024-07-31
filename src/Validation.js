/**
 * The Validation class provides functionalities for managing validation ID related data and interacting with a validation contract.
 * This class allows you to create validation ID objects, attach secure elements, set validation data, sign the data,
 * and publish or revoke the validation on a tydids blockchain.
 * 
 *   Creation: 
 *    - Instantiate a new Validation object using `new Validation()`.
 *   Data Population:
 *    - Use `setValidationObject()` to directly define key-value pairs (key_1, value_1, key_2, value_2) for the validation data.
 *    - Utilize `addPDF()` to attach a PDF file as validation data.
 *   Signing: 
 *    - Invoke `signAccountData()` to generate and set the accountSignature.
 *   Data Retrieval: 
 *    - Employ `toJSON()` to obtain a JSON representation of the validation data, including signatures.
 *   Secure Element Management:
 *    - Generate a new secure element using `retrieveSecureElement()` and store it securely.
 *    - Attach an existing secure element using `attachSecureElement()` to enable signing and contract interaction.
 *   Publication and Revocation:
 *    - Use `publish()` to announce the validation on the blockchain (requires an attached secure element).
 *    - Employ `revoke()` to invalidate the validation on the blockchain (requires an attached secure element).
 *   Persistence:
 *    - Save the validation data as a JSON string using `toJSON()`.
 *    - Restore the validation data from a JSON string using `openJSON()` on a newly created Validation instance.
 */

const ethers = require("ethers");
const axios = require('axios');

const env = require("./Env.js");

class Validation {

    /**
     * Constructs a new instance of the class. Initializes the object with default values for the following properties:
     * - validationSecureElement: a randomly generated ethers.Wallet object
     * - isMutable: a boolean indicating whether the object is mutable or not
     * - validationData: an empty object to store validation data
     * - validationSignature: an empty string for the validation signature
     * - accountData: an empty object to store account data
     * - accountSignature: an empty string for the account signature
     * - validationID: the address of the validation secure element
     * - account: a string representing the account address ("0x0" by default)
     * - isSigned: a boolean indicating whether the object is signed or not
     */
    constructor() {
        this.validationSecureElement = ethers.Wallet.createRandom();
        this.isMutable = true;
        this.validationObject = {};
        this.validationData = "";
        this.validationSignature = "";
        this.accountData = {};
        this.accountSignature = "";
        this.validationID = this.validationSecureElement.address;
        this.account = "0x0";
        this.isSigned = false;
        this.provider = new ethers.providers.JsonRpcProvider(env._RPC_URL);        
        this.validationSecureElement = this.validationSecureElement.connect(this.provider)
    } 

    /**
     * Returns an object containing the validation data, validation signature, account data, and account signature.
     *
     * @return {Object} An object with the following properties:
     *   - validationData: The validation data stored in the object.
     *   - validationSignature: The validation signature stored in the object.
     *   - accountData: The account data stored in the object.
     *   - accountSignature: The account signature stored in the object.
     */
    getFields() {               
        return {
            validationData: this.getValidationObjectToData(),
            validationSignature: this.validationSignature,
            accountData: encodeURIComponent(JSON.stringify(this.accountData)),
            accountSignature: this.accountSignature
        }
        
    }

    /**
     * Converts the object to a JSON string representation by calling the `getFields()` method and
     * using `JSON.stringify()` to serialize the result.
     *
     * @return {string} A JSON string representation of the object.
     */
    toJSON() {
        return JSON.stringify(this.getFields());
    }

    /**
     * Asynchronously retrieves the secure element by encrypting it with the provided password.
     *
     * @param {string} password - The password used to encrypt the secure element.
     * @return {Promise<string>} A promise that resolves to the encrypted secure element.
     */
    async retrieveSecureElement(password) {        
        return await this.validationSecureElement.encrypt(password);
    }

    /**
     * Asynchronously attaches a secure element to the current object by decrypting the provided encrypted JSON
     * using the provided password. If the decrypted address does not match the validation ID, an Error is thrown.
     *
     * @param {string} encryptedJSON - The encrypted JSON representing the secure element.
     * @param {string} password - The password used to decrypt the secure element.
     * @return {Promise<void>} A Promise that resolves when the secure element is successfully attached.
     * @throws {Error} If the decrypted address does not match the validation ID.
     */
    async attachSecureElement(encryptedJSON,password) {
        this.isMutable = false;
        this.validationSecureElement = await ethers.Wallet.fromEncryptedJson(encryptedJSON,password);                
        if(this.validationSecureElement.address !== this.validationID) throw Error("Secure Element does not match Validation");
        this.validationSecureElement = this.validationSecureElement.connect(this.provider);
        this.isMutable = true;
    }

    async addPDF(pdf64,filename) {
        const data = {
            did:JSON.stringify({pdf64: pdf64})
        }
        const response = await axios.post('https://api.corrently.io/v2.0/ipfs/announce', data)        
        this.validationObject.key_1 = "Attachment";
        this.validationObject.value_1 = filename;
        this.validationObject.key_2 = "Hash"; 
        this.validationObject.value_2 = response.data.Hash;
    }

    /**
     * Open the fields of the validation object by populating the object with the provided data and signatures.
     *
     * @param {string} validationData - The validation data to populate the object with.
     * @param {string} validationSignature - The signature of the validation data.
     * @param {string} accountData - The account data to populate the object with.
     * @param {string} accountSignature - The signature of the account data.
     * @throws {Error} If the validation ID or iat is not specified in the validation data.
     * @throws {Error} If the account is not specified in the validation data.
     * @throws {Error} If the validation signature does not match the validation ID.
     * @throws {Error} If the account signature does not match the account.
     */
    openFields(validationData, validationSignature, accountData, accountSignature) {
        this.isMutable = false;
        this.validationSecureElement = ethers.Wallet.createRandom();
        this.validationSecureElement = this.validationSecureElement.connect(this.provider)
        // Signature Validation (Consistency)

        const accountConsens = ethers.utils.verifyMessage(accountData,accountSignature);
        
        // Populate Object instance
        this.validationObject = decodeURIComponent(validationData);     
        try {         
            while(typeof this.validationObject !== 'object') {
                this.validationObject = JSON.parse(this.validationObject);
            }    
        }  catch(e) {
            throw Error("Unable to parse JSON to create validationObject");
        }   
        const validationConsens = ethers.utils.verifyMessage(this.getValidationObjectToData(),validationSignature);     
        if(typeof this.validationObject.validationID !== 'undefined') this.validationID = this.validationObject.validationID; else throw Error("validationID not specified");
        if(typeof this.validationObject.iat !== 'undefined') this.iat = this.validationObject.iat; else throw Error("iat not specified");
        if(typeof this.validationObject.account !== 'undefined') this.account = this.validationObject.account; else throw Error("account not specified");
                
        this.validationSignature = validationSignature;                
        this.accountData = JSON.parse(decodeURIComponent(accountData));

        while(typeof this.accountData !== 'object') {
            this.accountData = JSON.parse(this.accountData);
        }           
        this.accountSignature = accountSignature;      

        // Ensure Consensus        
        if(this.validationID !== validationConsens) throw new Error("validationSignature broken");        
        if(this.account !== accountConsens) throw new Error("accountSignature broken");
        this.validationData = this.getValidationObjectToData();
    }


    /**
     * Parses the provided JSON string and opens the fields using the `openFields` method.
     *
     * @param {string|object} json - The JSON string or object to parse.
     * @return {Promise<void>} A promise that resolves when the fields are opened.
     */
    openJSON(json) {
        while(typeof json !== 'object') {
            json = JSON.parse(json);
        }
        return this.openFields(json.validationData,json.validationSignature,json.accountData,json.accountSignature);
    }
    /**
     * Returns the validation data as a URI-encoded JSON string.
     *
     * @return {string} The URI-encoded JSON string representation of the validation data.
     */
    getValidationObjectToData() {
        return encodeURIComponent(JSON.stringify(this.validationObject));
    }

    /**
     * Sets the validation data for the object, ensuring that only allowed fields are present.
     *
     * @param {Object} obj - The object containing the validation data to set.
     * @throws {Error} If the object is not mutable.
     * @return {Promise<void>} A promise that resolves when the validation data has been set.
     */
    async setValidationObject(obj) {
        if(!this.isMutable) throw Error("Validation is imutable");

        // we only allow key_1,key_2,value_1 and value_2 as fields
        for (const [key, value] of Object.entries(obj)) {
            if( 
                (key !== 'key_1') && 
                (key !== 'key_2') &&
                (key !== 'value_1') &&
                (key !== 'value_2') 
            ) delete obj[key];
        }
        this.validationObject = JSON.parse(JSON.stringify(obj)); // DeepCopy        
        this.validationObject.account = this.account;
        this.validationObject.validationID = this.validationID;
        this.validationObject.iat = Math.floor(Date.now()/1000);
        this.validationSignature = await this.validationSecureElement.signMessage(this.getValidationObjectToData());    
        this.accountData = {
            validationSignature: this.validationSignature,
            validationID: this.validationID,
            account: this.account
        };
        this.validationData = this.getValidationObjectToData();
        this.accountSignature = null;
        this.isSigned = false;        
    } 


    /**
     * Announces the current validation by calling the `publish` function of the `Contract` object.
     *
     * @return {Promise<ethers.providers.TransactionReceipt>} A promise that resolves to the transaction receipt of the publish transaction.
     */
    async publish() {                
        const sc = new ethers.Contract(env._publishContract, env._publishAbi, this.validationSecureElement);      
        const rcp = await sc.publish();
        const receipt = await rcp.wait();
        return receipt;
    }

    /**
     * Checks if the current validation is published by calling the `publishs` function of the `Contract` object.
     *
     * @return {Promise<any>} A promise that resolves to the result of the `publishs` function with time stamp of publishing or 0
     */
    async isPublishedAt() {                
        const sc = new ethers.Contract(env._publishContract, env._publishAbi, this.validationSecureElement);      
        const rcp = await sc.publishs(this.validationID);
        return rcp.toString() * 1;    
    }

    /**
     * Asynchronously revokes this validation by calling the `revoke` function on the contract instance
     * and waiting for the transaction to be mined. Returns the transaction receipt.
     *
     * @return {Promise<object>} The transaction receipt object.
     */
    async revoke() {
        const sc = new ethers.Contract(env._revokeContract, env._revokeAbi, this.validationSecureElement);      
        const rcp = await sc.revoke();
        const receipt = await rcp.wait();
        return receipt;
    }

    /**
     * Asynchronously upvotes a given address by calling the `upvote` function on the contract instance
     * and waiting for the transaction to be mined. Returns the transaction receipt.
     *
     * @param {string} address - The address to upvote.
     * @return {Promise<object>} The transaction receipt object.
     */
    async upvote(address) {
        const sc = new ethers.Contract(env._voteContract, env._voteABI, this.validationSecureElement);      
        const rcp = await sc.upvote(address);
        const receipt = await rcp.wait();
        return receipt;
    }

    /**
     * Asynchronously downvotes a given address by calling the `downvote` function on the contract instance
     * and waiting for the transaction to be mined. Returns the transaction receipt.
     *
     * @param {string} address - The address to downvote.
     * @return {Promise<object>} The transaction receipt object.
     */
    async downvote(address) {
        const sc = new ethers.Contract(env._voteContract, env._voteABI, this.validationSecureElement);      
        const rcp = await sc.downvote(address);
        const receipt = await rcp.wait();
        return receipt;
    }

    /**
     * Asynchronously retrieves the number of upvotes and downvotes for a this validation ID.
     *
     * @return {Promise<Object>} An object containing the number of upvotes and downvotes.
     *                          The object has the following properties:
     *                          - upvotes: The number of upvotes as a number.
     *                          - downvotes: The number of downvotes as a number.
     */
    async votes() {
        const sc = new ethers.Contract(env._voteContract, env._voteABI, this.validationSecureElement);      
        const upvotes = await sc.upvoteCount(this.validationID);        
        const downvotes = await sc.downvoteCount(this.validationID);
        
        return {
            upvotes: upvotes.toString() * 1,
            downvotes: downvotes.toString() * 1
        };
    }

    /**
     * Asynchronously retrieves the list of upvotes and downvotes for validation ID.
     *
     * @return {Promise<Object>} An object containing the list of upvotes and downvotes.
     *                          The object has the following properties:
     *                          - upvoters: An array of upvoters' addresses.
     *                          - downvoters: An array of downvoters' addresses.
     */
    async listVotes() {
        const cnt = await this.votes();
        const sc = new ethers.Contract(env._voteContract, env._voteABI, this.validationSecureElement);  
        let upvotes = [];
        for(let i=0;i<cnt.upvotes;i++) {
                upvotes.push(await sc.upvoters(this.validationID,i));  
        } 
        let downvotes = [];
        for(let i=0;i<cnt.downvotes;i++) {
            downvotes.push(await sc.downvoters(this.validationID,i));  
        }     
        return {
            upvoters:upvotes,
            downvoters:downvotes
        };
    }

    /**
     * Asynchronously checks if the current validation is revoked by calling the `revocations` function on the contract instance
     * and waiting for the result. Returns the result as a time of revocation or 0.
     *
     * @return {Promise<number>} Returns revocation timestamp or 0 if not revoked.
     */
    async isRevokedAt() {
        const sc = new ethers.Contract(env._revokeContract, env._revokeAbi, this.validationSecureElement);      
        const rcp = await sc.revocations(this.validationID);
        return rcp.toString() * 1;    
    }
    /**
     * Attaches a signer to the current instance.
     *
     * @param {Object} signer - The signer object.
     * @return {void}
     */
    attachSigner(signer) {
        this.signer = signer;
        this.account = signer.address;        
        this.isMutable = true;
    }

    /**
     * Signs the account data using the signer and updates the account signature and isSigned status.
     *
     * @return {Promise<void>} A Promise that resolves when the account data is signed.
     */
    async signAccountData() {       
        this.accountSignature = await this.signer.signMessage(this.getFields().accountData);
        this.isSigned = true;
    }
}  
module.exports = Validation;