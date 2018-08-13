pragma solidity ^0.4.24;
import "./BlockPoem.sol";

contract BlockPoemFactory {
    address[] public deployedPoems;

    function createPoem(string _text, address _writer) public {
        address newPoem = new BlockPoem(_text, _writer);
        deployedPoems.push(newPoem);
    }

    function getDeployedPoems() public view returns (address[]) {
        return deployedPoems;
    }
}
