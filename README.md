# BlockPoems

This project allows users to write poems, view them, and donate to them on their
local blockchain.

It uses a factory contract whose job is to maintain an array of deployed poems.
So rather than deploying the poems themselves, users call the createPoem() method
on the factory instance with two arguments, the text of the poem as well as the
address they are using.

By giving the address to the factory, the factory can then assign the address as the
owner of the poem. This prevents the factory (msg.sender) from having ownership.

One a poem is deployed by the factory, it can be viewed and donated to by
any user. The donate function sends donated ether to whatever address is stored
as the writer/owner. I have hardcoded .0001 ether as the donation, but will change
this in the future.

There is additional functionality in the BlockPoem contract, like "liking", but
I have not implemented that in the UI yet.

### Dependencies

nodejs

ganache-cli

truffle

### Installing

Clone the repository

```
git clone https://github.com/Dmaradan/BlockPoems.git yourDirectory
cd yourDirectory
```

Install packages and make 1 edit

```
npm install
```

```
With your text editor, open /node_modules/truffle-contract/contract.js and
make the following edit on lines 21-23:

Provider.prototype.sendAsync = function() {
return this.provider.send.apply(this.provider, arguments);
};

Instead of

Provider.prototype.sendAsync = function() {
return this.provider.sendAsync.apply(this.provider, arguments);
};

provider.sendAsync doesn't seem to work with this version of web3
```

Run ganache-cli in a different terminal

```
ganache-cli
```

Back in the project directory, compile and migrate contracts

```
truffle compile
truffle migrate
```

Spin up the backend

```
npm run start
```

Navigate to localhost:3000 and enjoy!

## Running the tests

```
truffle test
```
