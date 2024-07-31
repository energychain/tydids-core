var assert = require('assert');

describe('Validation', function () {

  /**
   * Test instanciation with working parameters
   */
  describe('#Core Methods', () => {

    const Validation = require("../src/Validation.js");
    const ethers = require("ethers");

    it('key_1/value_1 is available', async function () {
        const mySigner = new ethers.Wallet.createRandom();
        const randomKey = ""+Math.random();
        const randomValue = ""+Math.random();

        const instance = new Validation();       
        instance.attachSigner(mySigner);

        await instance.setValidationObject({
            key_1:randomKey,
            value_1:randomValue
        });        
        assert.equal(instance.validationObject.key_1, randomKey);            
        return;  
    });

    it('payload is file', async function () {
        const mySigner = new ethers.Wallet.createRandom();
        const randomFileContents = ""+Math.random();        

        const instance = new Validation();       
        instance.attachSigner(mySigner);

        await instance.addPDF(randomFileContents);

        assert.equal(instance.validationObject.key_1, "Attachment");            
        assert.equal(instance.validationObject.key_2, "Hash");            
        return;  
    });
    
    it('Signature Update on key/value change', async function () {
        const mySigner = new ethers.Wallet.createRandom();
        const randomKey = ""+Math.random();
        const randomValue = ""+Math.random();
        const randomValue2 = ""+Math.random();

        const instance = new Validation();       
        instance.attachSigner(mySigner);

        await instance.setValidationObject({
            key_1:randomKey,
            value_1:randomValue
        });        
        assert.equal(instance.validationObject.value_1, randomValue);    
        const signatureA = instance.validationSignature;
        await instance.setValidationObject({
            key_1:randomKey,
            value_1:randomValue2
        });   
        assert.equal(instance.validationObject.value_1, randomValue2);    
        assert.equal(instance.validationSignature !== signatureA, true);         
        return;  
    });
    
    it('AccountData Update on key/value change', async function () {
        const mySigner = new ethers.Wallet.createRandom();
        const randomKey = ""+Math.random();
        const randomValue = ""+Math.random();
        const randomValue2 = ""+Math.random();

        const instance = new Validation(); 
        instance.attachSigner(mySigner);

        await instance.setValidationObject({
            key_1:randomKey,
            value_1:randomValue
        });        
        assert.equal(instance.validationObject.value_1, randomValue);    
        const accountDataA = instance.accountData;
        await instance.setValidationObject({
            key_1:randomKey,
            value_1:randomValue2
        });   
        assert.equal(instance.accountData !== accountDataA, true);    
        return;  
    });
    
    it('Validate isSigned flag gets handled', async function () {
        const mySigner = new ethers.Wallet.createRandom();
        const randomKey = ""+Math.random();
        const randomValue = ""+Math.random();
        const randomValue2 = ""+Math.random();

        const instance = new Validation();     
        instance.attachSigner(mySigner);    
        await instance.setValidationObject({
            key_1:randomKey,
            value_1:randomValue
        });        
        assert.equal(instance.isSigned, false); 
        await instance.signAccountData();
        assert.equal(instance.isSigned, true);

        return;  
    });
    
    it('Verify account is signee', async function () {
        const mySigner = new ethers.Wallet.createRandom();
        const randomKey = ""+Math.random();
        const randomValue = ""+Math.random();
        const randomValue2 = ""+Math.random();

        const instance = new Validation();     
        instance.attachSigner(mySigner);    
        await instance.setValidationObject({
            key_1:randomKey,
            value_1:randomValue
        });                
        await instance.signAccountData();
        const signee = ethers.utils.verifyMessage(instance.getFields().accountData,instance.getFields().accountSignature);       
        assert.equal(signee, instance.account);        
        return;  
    });
    
    it('Verify openFields works', async function () {
        const mySigner = new ethers.Wallet.createRandom();
        const randomKey = ""+Math.random();
        const randomValue = ""+Math.random();

        const instance = new Validation();     
        instance.attachSigner(mySigner);    
        await instance.setValidationObject({
            key_1:randomKey,
            value_1:randomValue
        });                
        await instance.signAccountData();
        const fields = JSON.parse(instance.toJSON());        
        const instance2 = new Validation();
        await instance2.openFields(fields.validationData,fields.validationSignature,fields.accountData,fields.accountSignature);
        assert.equal(instance2.account, instance.account);        
        assert.equal(instance2.getValidationObjectToData(), instance.getValidationObjectToData()); 
        assert.equal(instance2.isMutable, false); 
        assert.equal(instance.isMutable, true); 
        assert.equal(instance2.isSigned, false); 
        assert.equal(instance.isSigned, true); 
        return;  
    });
   
    it('Verify openJSON works', async function () {
        const mySigner = new ethers.Wallet.createRandom();
        const randomKey = ""+Math.random();
        const randomValue = ""+Math.random();

        const instance = new Validation();     
        instance.attachSigner(mySigner);    
        await instance.setValidationObject({
            key_1:randomKey,
            value_1:randomValue
        });                
        await instance.signAccountData();
        const json = instance.toJSON();

        const instance2 = new Validation();
        await instance2.openJSON(json);
        assert.equal(instance2.account, instance.account);        
        assert.equal(instance2.getValidationObjectToData(), instance.getValidationObjectToData()); 
        assert.equal(instance2.isMutable, false); 
        assert.equal(instance.isMutable, true); 
        assert.equal(instance2.isSigned, false); 
        assert.equal(instance.isSigned, true); 

        const instance3 = new Validation();
        await instance3.openJSON(JSON.stringify(json));
        assert.equal(instance3.account, instance.account);        
        assert.equal(instance3.getValidationObjectToData(), instance.getValidationObjectToData()); 
        assert.equal(instance3.isMutable, false);         
        assert.equal(instance3.isSigned, false); 
        
        return;  
    });
     
    it('Re-Use secure element', async function () {
        this.timeout(30000);
        const mySigner = new ethers.Wallet.createRandom();
        const randomKey = ""+Math.random();
        const randomValue = ""+Math.random();
        const password = ""+Math.random();

        const instance = new Validation();     
        instance.attachSigner(mySigner);    
        await instance.setValidationObject({
            key_1:randomKey,
            value_1:randomValue
        });                
        await instance.signAccountData();
        const json = instance.toJSON();
        const secElement = await instance.retrieveSecureElement(password);

        const instance2 = new Validation();
        await instance2.openJSON(json);
        await instance2.attachSecureElement(secElement,password);

        assert.equal(instance2.validationID, instance.validationID);        
        assert.equal(instance2.getValidationObjectToData(), instance.getValidationObjectToData()); 
                
        return;  
    });

    it('Check publish', async function () {
        this.timeout(30000);
        const mySigner = new ethers.Wallet.createRandom();
        const randomKey = ""+Math.random();
        const randomValue = ""+Math.random();
        const randomValue2 = ""+Math.random();

        const instance = new Validation();     
        instance.attachSigner(mySigner);    
        await instance.setValidationObject({
            key_1:randomKey,
            value_1:randomValue
        });                
        await instance.signAccountData();
        const notPublishedAt = await instance.isPublishedAt();
        assert.equal(notPublishedAt, 0);   
        await instance.publish();
        const signee = ethers.utils.verifyMessage(instance.getFields().accountData,instance.getFields().accountSignature);        
        assert.equal(signee, instance.account);     
        const publishedAt = await instance.isPublishedAt();
        assert.equal(publishedAt > (new Date().getTime() - 86400000)/1000, true);   
        return;  
    });
    it('Check revoke', async function () {
        this.timeout(30000);
        const mySigner = new ethers.Wallet.createRandom();
        const randomKey = ""+Math.random();
        const randomValue = ""+Math.random();
        const randomValue2 = ""+Math.random();

        const instance = new Validation();     
        instance.attachSigner(mySigner);    
        await instance.setValidationObject({
            key_1:randomKey,
            value_1:randomValue
        });                
        await instance.signAccountData();
        const notRevokedAt = await instance.isRevokedAt();
        assert.equal(notRevokedAt, 0);   
        await instance.revoke();        
        const revokedAt = await instance.isRevokedAt();
        assert.equal(revokedAt > (new Date().getTime() - 86400000)/1000, true);   
        return;  
    });
    
  });
  describe('#TyDIDsGraph Methods', () => {

    const Validation = require("../src/Validation.js");
    const ethers = require("ethers");

    it('upvote', async function () {
        this.timeout(30000);
        const mySigner = new ethers.Wallet.createRandom();
        const randomKey = ""+Math.random();
        const randomValue = ""+Math.random();
        const randomValue2 = ""+Math.random();

        const instance = new Validation();     
        await instance.upvote(instance.validationID);

        const votes = await instance.votes();
        assert.equal(votes.upvotes, 1);
        return;
    });
    it('downvote', async function () {
        this.timeout(30000);
        const mySigner = new ethers.Wallet.createRandom();
        const randomKey = ""+Math.random();
        const randomValue = ""+Math.random();
        const randomValue2 = ""+Math.random();

        const instance = new Validation();     
        await instance.downvote(instance.validationID);

        const votes = await instance.votes();
        assert.equal(votes.upvotes, 0);
        assert.equal(votes.downvotes, 1);
        return;
    });
    it('double upvote', async function () {
        this.timeout(30000);
        const mySigner = new ethers.Wallet.createRandom();
        const randomKey = ""+Math.random();
        const randomValue = ""+Math.random();
        const randomValue2 = ""+Math.random();

        const instance = new Validation();     
        await instance.upvote(instance.validationID);
        await instance.upvote(instance.validationID);
        const votes = await instance.votes();
        assert.equal(votes.upvotes, 1);
        
        return;
    });
    it('upvote and downvote', async function () {
        this.timeout(30000);
        const mySigner = new ethers.Wallet.createRandom();
        const randomKey = ""+Math.random();
        const randomValue = ""+Math.random();
        const randomValue2 = ""+Math.random();

        const instance = new Validation();     
        await instance.upvote(instance.validationID);
        await instance.downvote(instance.validationID);
        const votes = await instance.votes();
        assert.equal(votes.upvotes, 0);
        assert.equal(votes.downvotes, 1);
        return;
    });
  });
});