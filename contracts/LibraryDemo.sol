pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';

contract LibraryDemo {
  using SafeMath for uint;
    function exec(uint a, uint b) public pure returns (uint){
        return a.add(b);
    }
}
