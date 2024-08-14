window.TyDIDs = {
    Validation: require('./Validation.js'),
    DecentralizedIdentityConsent: require('./DecentralizedIdentityConsent.js'),
    SSI: require('./SSI.js'),
    Env: require('./Env.js'),
    SSIStatus: require('./SSIStatus.js'),
    external:  {
        ethers:require("ethers"),
        axios:require("axios")
    }
}
if(typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        if(typeof $ !== 'undefined') {
            const ssiElement = document.getElementById('ssiObject');
            if (ssiElement) {            
                const ssiObject = JSON.parse(ssiElement.textContent);
                const ssi = new window.TyDIDs.SSI(ssiObject.privateKey);   
                // Tweek some UI stuff from SSI html files.
                $('.card-footer').append(`<button class="btn btn-dark float-end" id="btnAddToWallet">Add to Wallet</button>`);
                $('.card-body').css("overflow","auto");   
                $('#btnAddToWallet').on('click',function(e) {
                    var iframe = document.createElement('iframe');
                    iframe.src = "https://wallet.tydids.com/";
                    iframe.style.display = "none"; // Hide the iframe                                      
                    document.body.appendChild(iframe);                                      
                    function onIframeLoad() {                      
                      if (iframe.contentDocument && iframe.contentDocument.readyState === "complete") {                        
                        iframe.contentWindow.postMessage(ssiObject, "*"); // "*" indicates all origins
                      } else {                        
                        setTimeout(onIframeLoad, 100);
                      }
                    }
                                      
                    onIframeLoad();
                  
                    // Prevent default button click behavior (optional)
                    e.preventDefault();
                });      
            } 
        }
    });
}