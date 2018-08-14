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

    let expectedLength = 1;

    assert.equal(poems.length, expectedLength, "There should be 1 poem");
  });

  it("should let writer add extra message", async function() {
    let instance = await BlockPoemFactory.deployed();
    let accounts = await web3.eth.getAccounts();
    let firstAccount = accounts[0];
    const poemInstance = await BlockPoem.at(poemAddress);

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

  it("should prevent others from adding extra message", async function() {
    let instance = await BlockPoemFactory.deployed();
    let accounts = await web3.eth.getAccounts();
    let secondAccount = accounts[1];
    const poemInstance = await BlockPoem.at(poemAddress);

    const secondMessage = "This is the second message";

    console.log("secondAccount: " + secondAccount);

    // We want this to fail because second account is not the writer
    try {
      await poemInstance.addMessage(secondMessage, {
        from: secondAccount
      });
      assert(false);
    } catch (err) {
      assert(true);
    }

    // let message = await poemInstance.extraMessage.call();
    //
    // console.log("stored message: " + message);
    //
    // const firstMessageHash = keccak256(message);
    // const secondMessageHash = keccak256(secondMessage);
    //
    // assert.notEqual(firstMessageHash, secondMessageHash);
  });
});
