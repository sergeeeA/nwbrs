// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

contract Lottery {
    address public owner;
    address payable[] public players;
    address[] public winners;
    uint public lotteryId;

    constructor() {
        owner = msg.sender;
        lotteryId = 0;
    }

    function getWinners() public view returns (address[] memory) {
        return winners;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function enter() public payable {
        require(msg.value >= .01 ether, "Minimum entry fee is 0.01 ETH");

        // address of player entering lottery
        players.push(payable(msg.sender));

        // Check if there are exactly two players
        if (players.length == 2) {
            pickWinner();
        }
    }

    function getRandomNumber() public view returns (uint) {
        return uint(keccak256(abi.encodePacked(owner, block.timestamp)));
    }

    function getLotteryId() public view returns (uint) {
        return lotteryId;
    }

    function pickWinner() public {
        require(players.length == 2, "There must be exactly two players to pick a winner");

        uint balance = address(this).balance;
        uint tax = balance / 10;  // 10% tax
        uint winnerAmount = balance - tax;

        // Calculate random winner index
        uint randomIndex = getRandomNumber() % players.length;

        // Transfer the tax to the owner
        payable(owner).transfer(tax);

        // Transfer the remaining balance to the winner
        players[randomIndex].transfer(winnerAmount);

        // Record the winner
        winners.push(players[randomIndex]);
        lotteryId++;

        // Clear the players array
        delete players;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }
}
