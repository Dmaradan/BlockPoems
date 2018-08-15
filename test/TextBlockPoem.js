var BlockPoem = artifacts.require("./BlockPoem.sol");
var BlockPoemFactory = artifacts.require("./BlockPoemFactory.sol");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

let poemAddress;
let accounts;
let firstAccount;
let secondAccount;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  firstAccount = accounts[0];
  secondAccount = accounts[1];
});

contract("BlockPoemFactory", function() {
  it("should create a poem", async function() {
    let instance = await BlockPoemFactory.deployed();

    await instance.createPoem("this is a poem", firstAccount);

    let poems = await instance.getDeployedPoems.call({ from: accounts[0] });
    poemAddress = poems[0];

    let expectedLength = 1;

    assert.equal(poems.length, expectedLength, "There should be 1 poem");
  });
});

describe("BlockPoem", function() {
  it("should let writer add extra message", async function() {
    const poemInstance = await BlockPoem.at(poemAddress);

    await poemInstance.addMessage("this is an extra message noice", {
      from: firstAccount
    });

    let message = await poemInstance.extraMessage.call();
    console.log(message);

    assert.ok(message);
  });

  it("should prevent others from adding extra message", async function() {
    const poemInstance = await BlockPoem.at(poemAddress);

    const secondMessage = "This is the second message";

    // We want this to fail because second account is not the writer
    try {
      await poemInstance.addMessage(secondMessage, {
        from: secondAccount
      });
      assert(false);
    } catch (err) {
      assert(true);
    }
  });

  it("should let others like a poem", async function() {
    const poemInstance = await BlockPoem.at(poemAddress);

    await poemInstance.like({ from: secondAccount });

    const expectedNumOfLikes = 1;

    let numberOfLikes = await poemInstance.numberOfLikes.call();

    assert.equal(numberOfLikes, expectedNumOfLikes);
  });

  it("should prevent an account from liking a poem more than once", async function() {
    const poemInstance = await BlockPoem.at(poemAddress);

    try {
      await poemInstance.like({ from: secondAccount });
      assert(false);
    } catch (err) {
      assert(true);
    }
  });

  it("should prevent the writer from liking their own poem", async function() {
    const poemInstance = await BlockPoem.at(poemAddress);

    try {
      await poemInstance.like({ from: firstAccount });
      assert(false);
    } catch (err) {
      assert(true);
    }
  });

  it("accepts donations", async function() {
    const poemInstance = await BlockPoem.at(poemAddress);
    let balance = await web3.eth.getBalance(firstAccount);
    let weiToDonate = "100000000000000";

    let secondAccountBalance = await web3.eth.getBalance(secondAccount);

    try {
      await poemInstance.donate({ value: weiToDonate, from: secondAccount });
    } catch (err) {
      console.log("You probably sent less wei than minimumDonation value");
      assert(false);
    }

    secondAccountBalance = await web3.eth.getBalance(secondAccount);

    let newBalance = await web3.eth.getBalance(firstAccount);
    newBalance = web3.utils.fromWei(newBalance, "ether");
    newBalance = parseFloat(newBalance);

    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);
    weiToDonate = parseFloat(weiToDonate);

    assert.isAbove(newBalance, balance);
  });
});
