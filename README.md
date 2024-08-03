# tydids-validation
**tydids-validation is a Node.js package that provides functionalities for Decentralized Identity (DID) based validation, authentication, and data privacy consent.**

[Project Homepage](https://corrently.io/books/tydids-trust-framework) | [JSFiddle](https://jsfiddle.net/stromdao/87fqscw0/11/)

<html>
<script async src="//jsfiddle.net/stromdao/87fqscw0/11/embed/js,html,css,result/dark/"></script>
</html>

### Installation

There are two ways to install `tydids-validation`:

**Using npm:**

```
npm install tydids-validation
```

This will install the package and its dependencies locally for use in your Node.js project.

**Using HTML:**

You can directly include the library in your HTML project using a CDN link:

```
<script src="https://unpkg.com/tydids-validation@latest/dist/tydids.js"></script>
<script>
   const validation = new window.TyDIDs.Validation();
   // or 
   const dataidentity = new window.TyDIDs.DataIdentity();
   // or 
   const ssi = new window.TyDIDs.SSI(key);
</script>
```

This approach is useful for quick integration in web applications without the need for local installation.

### Usage

For detailed usage examples and API reference, please refer to the files in the `./public` folder. You can also try a live demo of the functionalities at:

-   [https://energychain.github.io/tydids-validation/public/](https://energychain.github.io/tydids-validation/public/)


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

#### Shell Script

Install:
```shell
npm install -g tydids-validation
```

```shell
tydids -h
```

Revoke with given SSI File:
```shell
tydids revoke <path_to_ssi_*.html>
```

Check if granted:
```shell
tydids isgranted <identity>
```

### [Contributing](./CONTRIBUTING.md)

We welcome contributions to `tydids-validation`. If you have improvements or new features, please create a pull request on the project's GitHub repository.

### License

This project is licensed under the Apache-2.0 License. Please see the [LICENSE](LICENSE) file for more details.

## Test Cases

The repository includes test cases that demonstrate how to use the Validation class. To run the test cases, navigate to the project directory and run `npm test`.

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
