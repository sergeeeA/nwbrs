// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RandomWinner {

    address public user1;
    address public user2;
    address public winner;
    address public lastRecipient; // New state variable to store the last recipient address
    uint256 public constant DEPOSIT_AMOUNT = 1 ether; // Deposit amount set to 1 ETH
    bool public winnerChosen = false;

    event Deposited(address indexed user);
    event WinnerChosen(address indexed winner);
    event Reset();
    event TransferMade(address indexed recipient, uint256 amount);

    modifier onlyBeforeWinnerChosen() {
        require(!winnerChosen, "Winner has already been chosen");
        _;
    }

    modifier onlyOnce() {
        require(user1 == address(0) || user2 == address(0), "Both users have already deposited");
        _;
    }

    constructor() {}

    function deposit() external payable onlyBeforeWinnerChosen onlyOnce {
        require(msg.value == DEPOSIT_AMOUNT, "Deposit must be exactly 1 ETH");

        if (user1 == address(0)) {
            user1 = msg.sender;
        } else if (user2 == address(0)) {
            user2 = msg.sender;
            chooseWinner();
        } else {
            revert("Both users have already deposited");
        }

        emit Deposited(msg.sender);
    }

    function chooseWinner() internal {
        require(user1 != address(0) && user2 != address(0), "Both users must deposit before choosing a winner");

        // Generate a pseudo-random number to select the winner
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, user1, user2)));
        if (random % 2 == 0) {
            winner = user1;
        } else {
            winner = user2;
        }
        winnerChosen = true;

        // Transfer the total balance to the winner
        uint256 amount = address(this).balance;
        payable(winner).transfer(amount);
        lastRecipient = winner; // Update the last recipient

        emit WinnerChosen(winner);
        emit TransferMade(lastRecipient, amount);

        // Automatically reset the contract state
        reset();
    }

    function getLastWinner() external view returns (address) {
        return lastRecipient; // Return the last recipient address
    }

    function getUser1() external view returns (address) {
        return user1;
    }

    function getUser2() external view returns (address) {
        return user2;
    }

    function getWinnerChosenStatus() external view returns (bool) {
        return winnerChosen;
    }

    // Reset the contract state to allow for a new round
    function reset() internal {
        user1 = address(0);
        user2 = address(0);
        winner = address(0);
        winnerChosen = false;

        emit Reset();
    }
}
