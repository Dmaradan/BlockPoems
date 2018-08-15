var BlockPoem = artifacts.require("./BlockPoem.sol");
var BlockPoemFactory = artifacts.require("./BlockPoemFactory.sol");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

let poemAddress;
let poemText;
let secondPoemText;
let accounts;
let firstAccount;
let secondAccount;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  firstAccount = accounts[0];
  secondAccount = accounts[1];
});

/* The following tests make sure that the factory contract is correctly initializing
  and storing poems that users write. It's important that the factory doesn't assign
  itself as the owner, for example */

contract("BlockPoemFactory", function() {
  it("should create a poem", async function() {
    let instance = await BlockPoemFactory.deployed();
    poemText = "This is a great poem about decentralization";

    await instance.createPoem(poemText, firstAccount);

    let poems = await instance.getDeployedPoems.call({ from: accounts[0] });
    poemAddress = poems[0];

    let expectedLength = 1;

    assert.equal(poems.length, expectedLength, "There should be 1 poem");
  });

  it("should set correct poem text after creation", async function() {
    const poemInstance = await BlockPoem.at(poemAddress);

    const expectedText = poemText;

    let actualText = await poemInstance.poem.call();

    assert.equal(actualText, expectedText);
  });

  it("should set correct owner upon creation", async function() {
    const poemInstance = await BlockPoem.at(poemAddress);
    let poemOwner;

    poemOwner = await poemInstance.verifyOwner.call({ from: firstAccount });

    let lowerCaseFirstAccount = firstAccount.toLowerCase();
    assert.equal(poemOwner, lowerCaseFirstAccount);
  });

  it("should store multiple poems", async function() {
    let instance = await BlockPoemFactory.deployed();
    secondPoemText = "An epic about Dogecoin";

    await instance.createPoem(secondPoemText, secondAccount);

    let poems = await instance.getDeployedPoems.call();

    let expectedLength = 2;

    assert.equal(poems.length, expectedLength);
  });

  it("should be able to retrieve specific poem with public getter and index", async function() {
    let instance = await BlockPoemFactory.deployed();
    let retrievedPoemAddress = await instance.deployedPoems.call(1);
    let retrievedPoemInstance = await BlockPoem.at(retrievedPoemAddress);

    let retrievedPoemText = await retrievedPoemInstance.poem.call();

    assert.equal(retrievedPoemText, secondPoemText);
  });
});

/* The following tests make sure that writers have privacy and control of their
  poem, and that they cannot like their own poems. They also make sure that other users
  are able to like and donate ether, which is the incentive writers have to post their
  work */

describe("BlockPoem", function() {
  it("should prevent other accounts from retrieving writer account", async function() {
    const poemInstance = await BlockPoem.at(poemAddress);

    try {
      await poemInstance.verifyOwner.call({ from: secondAccount });
      assert(false);
    } catch (err) {
      assert(true);
    }
  });

  it("should let writer add extra message", async function() {
    const poemInstance = await BlockPoem.at(poemAddress);

    await poemInstance.addMessage("this is an extra message", {
      from: firstAccount
    });

    let message = await poemInstance.extraMessage.call();

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
