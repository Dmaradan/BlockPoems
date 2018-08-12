pragma solidity ^0.4.24;

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

  constructor(string _thePoem) {
    poem = _thePoem;
    writer = msg.sender;
  }

  function addMessage(string _extraMessage) onlyOwner public {
    extraMessage = _extraMessage;
  }

  function like() notOwner public {
    require(fans[msg.sender] = false);
    fans[msg.sender] = true;
    numberOfLikes += 1;
  }

  function donate() public payable {
    writer.transfer(msg.value);
  }
}
