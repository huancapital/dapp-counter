/**
 *Submitted for verification at testnet.bscscan.com on 2025-05-24
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract CounterContract {
    uint256 public count;
    uint256 public feeAmount;
    uint256 public feeAdmin;
    address public feeRecipient;
    address public adminAccount = 0x9E1B3806cf530b31673e453169a58C882AC53951;

    event FeeCollected(address indexed user, uint256 amount);
    event AdminFeeCollected(address indexed user, uint256 amount);

     constructor() {
        feeAmount = 0.001 ether; // 0.001 tBNB fee for BNB testnet (~$0.60)
        feeAdmin = 0.00005 ether;
        feeRecipient = 0xd0044e990a292162a70ee14dF9C0DB4c1CB37B36; // Fee recipient address
    }

    // Require fee for user
    modifier requireFee() {
        require(msg.value >= feeAmount, "Insufficient fee payment");
        // Send fee directly to recipient
        payable(feeRecipient).transfer(msg.value);
        emit FeeCollected(msg.sender, msg.value);
        _;
    }
    
    // only admin can call this function
    modifier onlyAdmin() {
        require(msg.sender == adminAccount, "Only admin can call this function");
        // Send fee directly to admin
        payable(feeRecipient).transfer(msg.value);
        emit AdminFeeCollected(msg.sender, msg.value);
        _;
    }

    // Function 1: Get the current count
    function get() public view returns (uint256) {
        return count;
    }

    // Function 4: Double increment count by 2 (requires 0.00005 tBNB fee)
    function doubleIncrement() public payable onlyAdmin {
        count += 2;
    }

    // Function 2: Increment count by 1 (requires 0.001 tBNB fee)
    function inc() public payable requireFee {
        count += 1;
    }

    // Function 3: Decrement count by 1 (requires 0.001 tBNB fee)
    function dec() public payable requireFee {
        require(count > 0, "Count cannot be negative");
        count -= 1;
    }
}
