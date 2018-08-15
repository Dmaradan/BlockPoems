pragma solidity ^0.4.24;
import "./BlockPoem.sol";

/** @title BlockPoem Factory. */
contract BlockPoemFactory {
    address[] public deployedPoems;

    /** @dev Creates BlockPoems and stores their addresses.
      * @param _text The poem text.
      * @param _writer The writer and owner of the poem.
      */
    function createPoem(string _text, address _writer) public {
        address newPoem = new BlockPoem(_text, _writer);
        deployedPoems.push(newPoem);
    }

    /** @dev Returns an array of deployed BlockPoem addresses
      */
    function getDeployedPoems() public view returns (address[]) {
        return deployedPoems;
    }
}
