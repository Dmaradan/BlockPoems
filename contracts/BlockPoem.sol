pragma solidity ^0.4.24;

contract BlockPoem {
  string public poem;
  string public extraMessage;
  uint public numberOfLikes;
  uint private minimumDonation;
  bool isStopped = false;

  address private writer;
  mapping(address => bool) private fans;

  // Modifiers
  /** @dev Ensures only the writer can call.
    */
  modifier onlyOwner() {
    require(writer == msg.sender);
    _;
  }

  /** @dev Ensures the writer cannot call.
    */
  modifier notOwner() {
    require(writer != msg.sender);
    _;
  }

  /** @dev Ensures a fan of a poem cannot call.
    */
  modifier notFan() {
    require(fans[msg.sender] == false);
    _;
  }

  /** @dev Circuit breaker modifier.
    */
  modifier notStopped() {
    require(!isStopped);
    _;
  }

  /** @dev Constructor. Makes sure the writer is the account interacting with factory,
      not the factory itself
    */
  constructor(string _thePoem, address _theWriter) public {
    poem = _thePoem;
    writer = _theWriter;
    minimumDonation = 100000000000000;
  }

  /** @dev Circuit breaker methods.
    */
  function stopContract() public onlyOwner {
        isStopped = true;
    }

  function resumeContract() public onlyOwner {
      isStopped = false;
    }

  /** @dev Returns the writer's address.
    */
  function verifyOwner() onlyOwner notStopped public view returns (address) {
    return writer;
  }

  /** @dev Adds an extra message to the BlockPoem.
    * @param _extraMessage The poem's extra message text.
    */
  function addMessage(string _extraMessage) onlyOwner notStopped public {
    extraMessage = _extraMessage;
  }

  /** @dev Increments the BlockPoem's number of likes and adds a fan to its mapping.
    */
  function like() notOwner notFan notStopped public {
    fans[msg.sender] = true;
    numberOfLikes += 1;
  }

  /** @dev Donates ether to the BlockPoem's writer.
    */
  function donate() public payable notStopped {
    require(msg.value >= minimumDonation);
    writer.transfer(msg.value);
  }
}
