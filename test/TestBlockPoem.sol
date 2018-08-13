pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/BlockPoem.sol";

contract TestBlockPoem{
  //BlockPoem blockPoem = BlockPoem(DeployedAddresses.BlockPoem());

  beforeEach(() => {
    BlockPoem blockPoem = BlockPoem(DeployedAddresses.BlockPoem());
    })

  describe("Factory", async () => {
    it("deploys a factory", () => {
      Assert.ok(blockPoem.options.address);
      });
    });
}
