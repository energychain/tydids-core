# DataIdentity Class

The `DataIdentity` class is a JavaScript implementation that provides a mechanism for creating, managing, and verifying digital identities on a blockchain. It leverages a secure element to generate cryptographic keys and sign data, ensuring the authenticity and integrity of the created identity.

## Key Features

- **Identity Generation**: Creates a new, random identity with a corresponding private key on a secure element.
- **Payload Signing**: Signs arbitrary payloads with the private key associated with the identity.
- **Identity Publication**: Publishes the identity on a blockchain using a smart contract.
- **Identity Verification**: Verifies the publication status of an identity.
- **Identity Revocation**: Revokes a previously published identity via a smart contract.
- **Identity Disclosure**: Reveals the identity, private key, signature, and payload.

## Use Cases

- **Self-Sovereign Identity (SSI)**: The class can be used to create and manage decentralized identities that are independent of central authorities.
- **Authentication**: The identity can serve as the foundation for an authentication system, for example, to access resources or services.
- **Data Integrity**: The signature of the payload can be used to ensure the integrity of data.
- **Non-repudiation**: The published identity can serve as proof of the creation of a specific data signature.

## Methods

- `constructor(payload)`: Initializes a new instance of the `DataIdentity` class with the given payload.
- `#initSecureElement()`: Initializes the secure element and generates a new identity with a corresponding private key.
- `async consensus()`: Signs the payload with the private key associated with the identity.
- `async publish()`: Publishes the identity on a blockchain using a smart contract.
- `async isPublishedAt()`: Checks if the identity is published on the blockchain.
- `async revoke()`: Revokes a previously published identity via a smart contract.
- `async isRevokedAt()`: Checks if the identity is revoked on the blockchain.
- `async reveal()`: Returns the SSI and flushes the secure element.

## Dependencies

- [ethers.js](https://docs.ethers.io/v5/): A complete Ethereum wallet implementation and utilities in JavaScript.
- `./Env.js`: A module that provides environment variables such as the RPC URL and smart contract addresses and ABIs.