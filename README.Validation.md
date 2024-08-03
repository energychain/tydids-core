# tydids-validation
**Developers building applications on any ethereum based  blockchain can leverage the tydids-validation package to streamline the process of managing validation data. This library offers functionalities for secure data signing, contract interaction, and more.**

See it in action on https://tydids.com/.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Methods](#methods)
  - [Constructor](#constructor)
  - [getFields](#getfields)
  - [toJSON](#tojson)
  - [retrieveSecureElement](#retrievesecureelement)
  - [attachSecureElement](#attachsecureelement)
  - [addPDF](#addpdf)
  - [openFields](#openfields)
  - [openJSON](#openjson)
  - [getValidationObjectToData](#getvalidationobjecttodata)
  - [setValidationObject](#setvalidationobject)
  - [publish](#publish)
  - [isPublishedAt](#ispublishedat)
  - [revoke](#revoke)
  - [isRevokedAt](#isrevokedat)
  - [upvote](#upvote)
  - [downvote](#downvote)
  - [votes](#votes)
  - [attachSigner](#attachsigner)
  - [signAccountData](#signaccountdata)
- [Test Cases](#test-cases)
- [License](#license)
- [Maintainer / Impressum](#maintainer--impressum)

## Installation

### Use in scripts/modules/cli
```
npm install --save tydids-validation
```

### Use in browser
```html
<script src="https://unpkg.com/tydids-validation@latest/dist/tydids.js"></script>
<script>
   const validation = new window.TyDIDs.Validation();
</script>
```

## Usage

Here's an example of how to use the Validation class:

```javascript
const Validation = require("./Validation");
const ethers = require("ethers");

// Create a new Validation instance
const validation = new Validation();

// Attach a signer to the instance
const signer = new ethers.Wallet.createRandom();
validation.attachSigner(signer);

// Set validation data
await validation.setValidationObject({
  key_1: "Example Key",
  value_1: "Example Value",
});

// Sign the account data
await validation.signAccountData();

// Publish the validation
await validation.publish();

// Check if the validation is published
const publishedAt = await validation.isPublishedAt();
console.log("Published at:", publishedAt);
```

## Methods

### Constructor

Constructs a new instance of the class. Initializes the object with default values for various properties.

### getFields

Returns an object containing the validation data, validation signature, account data, and account signature.

### toJSON

Converts the object to a JSON string representation by calling the `getFields()` method and using `JSON.stringify()` to serialize the result.

### retrieveSecureElement

Asynchronously retrieves the secure element by encrypting it with the provided password.

### attachSecureElement

Asynchronously attaches a secure element to the current object by decrypting the provided encrypted JSON using the provided password.

### addPDF

Asynchronously adds a PDF file as validation data by uploading it to a Corrently IPFS service and storing the hash in the validation object.

### openFields

Opens the fields of the validation object by populating the object with the provided data and signatures.

### openJSON

Parses the provided JSON string and opens the fields using the `openFields` method.

### getValidationObjectToData

Returns the validation data as a URI-encoded JSON string.

### setValidationObject

Sets the validation data for the object, ensuring that only allowed fields are present.

### publish

Announces the current validation by calling the `publish` function of the validation contract.

### isPublishedAt

Checks if the current validation is published by calling the `publishs` function of the validation contract.

### revoke

Asynchronously revokes this validation by calling the `revoke` function on the validation contract and waiting for the transaction to be mined.

### isRevokedAt

Asynchronously checks if the current validation is revoked by calling the `revocations` function on the validation contract and waiting for the result.

### upvote

Asynchronously upvotes a given address by calling the `upvote` function on the contract instance and waiting for the transaction to be mined. Returns the transaction receipt.

### downvote

Asynchronously downvotes a given address by calling the `downvote` function on the contract instance and waiting for the transaction to be mined. Returns the transaction receipt.

### votes

Asynchronously retrieves the number of upvotes and downvotes for a this validation ID.

### attachSigner

Attaches a signer to the current instance.

### signAccountData

Signs the account data using the signer and updates the account signature and isSigned status.

## Test Cases

The repository includes test cases that demonstrate how to use the Validation class. To run the test cases, navigate to the project directory and run `npm test`.

## License
[Apache-2.0](LICENSE)


## Maintainer / Impressum

<addr>
STROMDAO GmbH  <br/>
Gerhard Weiser Ring 29  <br/>
69256 Mauer  <br/>
Germany  <br/>
  <br/>
+49 6226 968 009 0  <br/>
  <br/>
dev@stromdao.com  <br/>
  <br/>
Handelsregister: HRB 728691 (Amtsgericht Mannheim)<br/>
  <br/>
https://stromdao.de/<br/>
</addr>
