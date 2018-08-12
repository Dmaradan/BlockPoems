pragma solidity ^0.4.24;

contract BlockPoemFactory {
    address[] public deployedPoems;

    function createPoem(string _text) public {
        address newPoem = new BlockPoem(_text);
        deployedPoems.push(newPoem);
    }

    function getDeployedPoems() public view returns (address[]) {
        return deployedPoems;
    }
}

contract BlockPoem {
  string public poem;
  string public extraMessage;
  uint public numberOfLikes;

  address private writer;
  mapping(address => bool) private fans;

  // Events
  event Like(address fan);
  event Donation(uint amount);

  // Modifiers
  modifier onlyOwner() {
    require(writer == msg.sender);
    _;
  }

  modifier notOwner() {
    require(writer != msg.sender);
    _;
  }

  modifier notFan() {
    require(fans[msg.sender] == false);
    _;
  }

  constructor(string _thePoem) public {
    poem = _thePoem;
    writer = msg.sender;
  }

  function addMessage(string _extraMessage) onlyOwner public {
    extraMessage = _extraMessage;
  }

  function like() notOwner notFan public {
    fans[msg.sender] = true;
    numberOfLikes += 1;
  }

  function donate() public payable {
    writer.transfer(msg.value);
  }
}
