var BlockPoem = artifacts.require("./BlockPoem.sol");
var BlockPoemFactory = artifacts.require("./BlockPoemFactory.sol");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

contract("BlockPoemFactory", async function() {
  it("should create a poem", async function() {
    let instance = await BlockPoemFactory.deployed();
    let accounts = await web3.eth.getAccounts();

    console.log(accounts);

    instance.createPoem(
      "this is a poem",
      "0x4a103325DA40c09A6fFFc16dDb52535AB15881b7",
      { from: accounts[0] }
    );

    let poems = await instance.getDeployedPoems.call({ from: accounts[0] });
    let expectedLength = 1;

    assert.equal(poems.length, expectedLength, "There should be 1 poem");
  });
});
