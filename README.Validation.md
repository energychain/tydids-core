# Validation Class

The `Validation` class provides functionalities for managing validation ID related data and interacting with a validation contract. This class allows you to create validation ID objects, attach secure elements, set validation data, sign the data, and publish or revoke the validation on a tydids blockchain.

## Creation

- Instantiate a new `Validation` object using `new Validation()`.

## Data Population

- Use `setValidationObject()` to directly define key-value pairs (key_1, value_1, key_2, value_2) for the validation data.
- Utilize `addPDF()` to attach a PDF file as validation data.

## Signing

- Invoke `signAccountData()` to generate and set the accountSignature.

## Data Retrieval

- Employ `toJSON()` to obtain a JSON representation of the validation data, including signatures.

## Secure Element Management

- Generate a new secure element using `retrieveSecureElement()` and store it securely.
- Attach an existing secure element using `attachSecureElement()` to enable signing and contract interaction.

## Publication and Revocation

- Use `publish()` to announce the validation on the blockchain (requires an attached secure element).
- Employ `revoke()` to invalidate the validation on the blockchain (requires an attached secure element).

## Persistence

- Save the validation data as a JSON string using `toJSON()`.
- Restore the validation data from a JSON string using `openJSON()` on a newly created Validation instance.

## Methods

- `constructor()`: Initializes a new instance of the `Validation` class.
- `getFields()`: Returns an object containing the validation data, validation signature, account data, and account signature.
- `toJSON()`: Converts the object to a JSON string representation.
- `retrieveSecureElement(password)`: Asynchronously retrieves the secure element by encrypting it with the provided password.
- `attachSecureElement(encryptedJSON, password)`: Asynchronously attaches a secure element to the current object by decrypting the provided encrypted JSON using the provided password.
- `addPDF(pdf64, filename)`: Asynchronously adds a PDF file as validation data.
- `openFields(validationData, validationSignature, accountData, accountSignature)`: Open the fields of the validation object by populating the object with the provided data and signatures.
- `openJSON(json)`: Parses the provided JSON string and opens the fields using the `openFields` method.
- `getValidationObjectToData()`: Returns the validation data as a URI-encoded JSON string.
- `setValidationObject(obj)`: Sets the validation data for the object, ensuring that only allowed fields are present.
- `publish()`: Announces the current validation by calling the `publish` function of the `Contract` object.
- `isPublishedAt()`: Checks if the current validation is published by calling the `publishs` function of the `Contract` object.
- `revoke()`: Asynchronously revokes this validation by calling the `revoke` function on the contract instance and waiting for the transaction to be mined.
- `upvote(address)`: Asynchronously upvotes a given address by calling the `upvote` function on the contract instance and waiting for the transaction to be mined.
- `downvote(address)`: Asynchronously downvotes a given address by calling the `downvote` function on the contract instance and waiting for the transaction to be mined.
- `votes()`: Asynchronously retrieves the number of upvotes and downvotes for a this validation ID.
- `listVotes()`: Asynchronously retrieves the list of upvotes and downvotes for validation ID.
- `isRevokedAt()`: Asynchronously checks if the current validation is revoked by calling the `revocations` function on the contract instance and waiting for the result.
- `attachSigner(signer)`: Attaches a signer to the current instance.
- `signAccountData()`: Signs the account data using the signer and updates the account signature and isSigned status.

## Dependencies

- [ethers.js](https://docs.ethers.io/v5/): A complete Ethereum wallet implementation and utilities in JavaScript.
- [axios](https://axios-http.com/): A promise-based HTTP client for the browser and Node.js.
- `./Env.js`: A module that provides environment variables such as the RPC URL and smart contract addresses and ABIs.