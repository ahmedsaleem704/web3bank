// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Web3Bank {
    function transfer(address payable recipient, uint256 amount) external payable {
        require(msg.value == amount, "Amount sent does not match amount to transfer.");
        recipient.transfer(amount);
    }
}
