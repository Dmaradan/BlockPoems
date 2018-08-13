//var BlockPoem = artifacts.require("./BlockPoem.sol");
var BlockPoemFactory = artifacts.require("./BlockPoemFactory.sol");

module.exports = function(deployer) {
  //deployer.deploy(BlockPoem);
  deployer.deploy(BlockPoemFactory);
};
