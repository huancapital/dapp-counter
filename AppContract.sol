/**
 *Submitted for verification at testnet.bscscan.com on 2025-05-24
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Counter {
    uint256 public count;
    uint256 public feeAmount;
    address public owner;
    mapping(address => uint256) public collectedFees;

    event FeeSet(uint256 newFeeAmount);
    event FeeCollected(address indexed user, uint256 amount);
    event FeesWithdrawn(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier requireFee() {
        require(msg.value >= feeAmount, "Insufficient fee payment");
        collectedFees[owner] += msg.value;
        emit FeeCollected(msg.sender, msg.value);
        _;
    }

    constructor() {
        owner = msg.sender;
        feeAmount = 0.001 ether; // Default fee of 0.001 ETH
    }

    // Function to set the fee amount (only owner)
    function setFee(uint256 _newFeeAmount) public onlyOwner {
        feeAmount = _newFeeAmount;
        emit FeeSet(_newFeeAmount);
    }

    // Function to get the current count
    function get() public view returns (uint256) {
        return count;
    }

    // Function to increment count by 1 (requires fee)
    function inc() public payable requireFee {
        count += 10;
    }

    // Function to decrement count by 1 (requires fee)
    function dec() public payable requireFee {
        require(count > 0, "Count cannot be negative");
        count -= 1;
    }

    // Function to withdraw collected fees (only owner)
    function withdrawFees() public onlyOwner {
        uint256 amount = collectedFees[owner];
        require(amount > 0, "No fees to withdraw");
        collectedFees[owner] = 0;
        payable(owner).transfer(amount);
        emit FeesWithdrawn(owner, amount);
    }

    // Function to check contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
