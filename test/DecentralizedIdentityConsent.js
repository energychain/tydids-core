var assert = require('assert');

describe('DecentralizedIdentityConsent', function () {

  /**
   * Test instanciation with working parameters
   */
  describe('#Core Methods', () => {

    const DecentralizedIdentityConsent = require("../src/DecentralizedIdentityConsent.js");
    it('instanziation', async function () {
        const testPayload = {test:Math.random()};
        const instance = new DecentralizedIdentityConsent(testPayload);        
        
        const consensus = await instance.consensus();        
        assert.equal(consensus.signature.length,132);
        assert.equal(consensus.identity.length,42);
        assert.equal(JSON.stringify(testPayload), consensus.payload);            

        return;  
    });
    it('publish()', async function () {
        this.timeout(30000);
        const testPayload = {test:Math.random()};
        const instance = new DecentralizedIdentityConsent(testPayload);        
        
        const isPublishedAtUnpublished = await instance.isPublishedAt();
        assert.equal(isPublishedAtUnpublished,0);

        await instance.publish();
        
        const isPublishedAtPublished = await instance.isPublishedAt();
        assert.equal(isPublishedAtPublished > (new Date().getTime() - 86400000)/1000,true);

        return;  
    });
    it('revoke()', async function () {
        this.timeout(30000);
        const testPayload = {test:Math.random()};
        const instance = new DecentralizedIdentityConsent(testPayload);        
        
        const isNotRevoked = await instance.isRevokedAt();
        assert.equal(isNotRevoked,0);

        await instance.revoke();
        
        const isRevoked = await instance.isRevokedAt();
        assert.equal(isRevoked > (new Date().getTime() - 86400000)/1000,true);

        return;  
    });
    it('reveal()', async function () {
        this.timeout(30000);
        const testPayload = {test:Math.random()};
        const instance = new DecentralizedIdentityConsent(testPayload);        
        
        const revealedObject = await instance.reveal();    
        const secondRevealedObject = await instance.reveal();        
        assert.equal(revealedObject.identity !== secondRevealedObject.identity,true);
        assert.equal(revealedObject.payload,secondRevealedObject.payload);
        assert.equal(revealedObject.signature !== secondRevealedObject.signature,true);
        return;  
    });
  });
});