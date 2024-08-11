window.TyDIDs = {
    Validation: require('./Validation.js'),
    DecentralizedIdentityConsent: require('./DecentralizedIdentityConsent.js'),
    SSI: require('./SSI.js'),
    Env: require('./Env.js'),
    external:  {
        ethers:require("ethers"),
        axios:require("axios")
    }
}
if(typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        if(typeof $ !== 'undefined') {
            const ssiObject = document.getElementById('ssiObject');
            if (ssiObject) {            
                const ssiObject = JSON.parse(ssiObject.textContent);
                const ssi = new window.TyDIDs.SSI(ssiObject.privateKey);   
                // Tweek some UI stuff from SSI html files.
                $('.card-footer').append(`<button class="btn btn-dark float-end">Add to Wallet</button>`);
                $('.card-body').css("overflow","auto");         
            } 
        }
    });
}