// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

contract Lottery {
    address public owner;
    address payable[] public lotteryPlayers;
    address[] public winners;
    uint public lotteryId;

    // Mini-game variables
    address payable[2] public miniGamePlayers;
    uint public miniGameCount;
    bool public miniGameActive;
    uint public miniGamePool;
    address[] public miniGameWinners;

    // Separate balance tracking
    uint private lotteryBalance;
    uint private miniGameBalance;

    constructor() {
        owner = msg.sender;
        lotteryId = 0;
        miniGameCount = 0;
        miniGameActive = false;
        miniGamePool = 0;
        lotteryBalance = 0;
        miniGameBalance = 0;
    }

    function getWinners() public view returns (address[] memory) {
        return winners;
    }

    function getMiniGameWinners() public view returns (address[] memory) {
        return miniGameWinners;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getLotteryBalance() public view returns (uint) {
        return lotteryBalance;
    }

    function getMiniGamePool() public view returns (uint) {
        return miniGamePool;
    }

    function getMiniGameBalance() public view returns (uint) {
        return miniGameBalance;
    }

    function getLotteryPlayers() public view returns (address payable[] memory) {
        return lotteryPlayers;
    }

    function enter() public payable {
        require(msg.value >= .01 ether, "Minimum entry fee is 0.01 ETH");
        require(!miniGameActive, "Cannot enter the lottery while mini-game is active");

        lotteryPlayers.push(payable(msg.sender));
        lotteryBalance += msg.value; // Add the deposited amount to the lottery balance
    }

    function enterMiniGame() public payable {
        require(msg.value >= 4 ether, "Minimum entry fee is 4 ETH");
        require(miniGameCount < 2, "Mini-game is full");
        require(!miniGameActive, "Mini-game is already active");

        miniGamePlayers[miniGameCount] = payable(msg.sender);
        miniGameCount++;
        miniGamePool += msg.value;  // Add the deposited amount to the mini-game pool
        miniGameBalance += msg.value; // Add the deposited amount to the mini-game balance

        if (miniGameCount == 2) {
            miniGameActive = true;
            distributeMiniGamePrize();
        }
    }

    function getRandomNumber() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(owner, block.timestamp)));
    }

    function getLotteryId() public view returns (uint) {
        return lotteryId;
    }

    function pickWinner() public onlyOwner {
        require(lotteryPlayers.length > 0, "No players in the lottery");

        uint tax = lotteryBalance / 10;  // 10% tax
        uint winnerAmount = lotteryBalance - tax;

        // Calculate random winner index
        uint randomIndex = getRandomNumber() % lotteryPlayers.length;

        // Transfer the tax to the owner
        payable(owner).transfer(tax);

        // Transfer the remaining balance to the winner
        lotteryPlayers[randomIndex].transfer(winnerAmount);

        // Record the winner
        winners.push(lotteryPlayers[randomIndex]);
        lotteryId++;

        // Clear the lottery players array and reset balance
        delete lotteryPlayers;
        lotteryBalance = 0;
    }

    function distributeMiniGamePrize() private {
        require(miniGameActive, "Mini-game is not active");
        require(miniGameCount == 2, "Mini-game does not have exactly 2 players");

        uint tax = miniGamePool / 10;  // 10% tax
        uint prizeAmount = miniGamePool - tax;

        // Calculate random winner index for the mini-game
        uint randomIndex = getRandomNumber() % 2;

        // Transfer the tax to the owner
        payable(owner).transfer(tax);

        // Transfer the prize to the randomly selected mini-game winner
        miniGamePlayers[randomIndex].transfer(prizeAmount);

        // Record the mini-game winner
        miniGameWinners.push(miniGamePlayers[randomIndex]);

        // Reset mini-game state
        miniGameCount = 0;
        miniGameActive = false;
        miniGamePool = 0;  // Reset the mini-game pool
        miniGameBalance = 0; // Reset the mini-game balance
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }
}
