var BlockPoem = artifacts.require("./BlockPoem.sol");
var BlockPoemFactory = artifacts.require("./BlockPoemFactory.sol");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

contract("BlockPoemFactory", async function() {
  let poemAddress;

  it("should create a poem", async function() {
    let instance = await BlockPoemFactory.deployed();
    let accounts = await web3.eth.getAccounts();
    let firstAccount = accounts[0];

    console.log(accounts);
    console.log("firstAccount: " + firstAccount);
    console.log("defaultAccount: " + web3.eth.defaultAccount);

    await instance.createPoem("this is a poem", firstAccount);

    let poems = await instance.getDeployedPoems.call({ from: accounts[0] });
    poemAddress = poems[0];

    console.log("poems: ");
    console.log(poems);

    let expectedLength = 1;

    assert.equal(poems.length, expectedLength, "There should be 1 poem");
  });

  it("should let writer add extra message", async function() {
    let instance = await BlockPoemFactory.deployed();
    let accounts = await web3.eth.getAccounts();
    let firstAccount = accounts[0];
    const poemInstance = await BlockPoem.at(poemAddress);
    //let poemInstance = new BlockPoem(poemAddress);

    console.log("firstAccount: " + firstAccount);
    //console.log(web3.eth.getBalance(firstAccount));
    await poemInstance.addMessage("this is an extra message noice", {
      from: firstAccount
    });
    //console.log(web3.eth.getBalance(firstAccount));

    let message = await poemInstance.extraMessage.call();
    console.log(message);

    assert.ok(message);
  });
});
