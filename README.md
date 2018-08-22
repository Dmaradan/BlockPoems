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

Setup:

1.  run "ganache-cli" to start a local ethereum blockchain

2.  in another terminal window, navigate to the BlockPoems directory:

    A) run "npm install"

    B) With your text editor, open /node_modules/truffle-contract/contract.js and
    make the following edit on line 22:

    Provider.prototype.sendAsync = function() {
    return this.provider.send.apply(this.provider, arguments);
    };

    Instead of

    Provider.prototype.sendAsync = function() {
    return this.provider.sendAsync.apply(this.provider, arguments);
    };

    For some reason, sendAsync is not working properly with this version of web3.

    C) Run "truffle compile" and "truffle migrate"

3.  run "npm run start" to spin up a server on localhost:3000

4.  navigate to localhost:3000 in your browser
