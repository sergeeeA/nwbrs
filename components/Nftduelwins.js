import React, { useState } from 'react';
import Styles from '../styles/Stats.module.css';
import { useAppContext } from '../context/context';
import Web3 from 'web3'; // Import Web3

const Nftduelwins = () => {
  const {
    fetchPlayerTotalWins,
    playerTotaWins,
    fetchPlayerWins,
    playerWinsNFTduel,
    fetchPlayerWinsLottery,
    playerWinsLottery,
    fetchPlayerWinsMiniGame,
    playerWinsMiniGame,
    fetchPlayerWinsNFTLottery,
    playerWinsNFTLottery,
    fetchPlayerWinsMiniGameNFT,
    playerWinsMiniGameNFT,
    address,
  } = useAppContext(); // Fetch necessary data and functions from context

  // State for player wins
  const [wins, setWins] = useState(null);
  const [totalwins, setTotalWins] = useState(null);
  const [lotteryWins, setLotteryWins] = useState(null); // State for lottery wins
  const [miniGameWins, setMiniGameWins] = useState(null); // State for mini-game wins
  const [nftLotteryWins, setNftLotteryWins] = useState(null); // State for NFT lottery wins
  const [miniGameNftWins, setMiniGameNftWins] = useState(null); // State for MiniGame NFT wins

  // Initialize Web3 and the contract
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

  // Determine the display text for nftPrizePoolContract
  const handleClick = async () => {
    await handleFetchPlayerWins();
    await handleFetchPlayerTotalWins();
    await handleFetchPlayerWinsLottery(); // Fetch lottery wins
    await handleFetchPlayerWinsMiniGame(); // Fetch mini-game wins
    await handleFetchPlayerWinsNFTLottery(); // Fetch NFT lottery wins
    await handleFetchPlayerWinsMiniGameNFT(); // Fetch MiniGame NFT wins
  };

  const handleFetchPlayerWins = async () => {
    if (address) {
      await fetchPlayerWins(address);
      setWins(playerWinsNFTduel);
    }
  };

  const handleFetchPlayerTotalWins = async () => {
    if (address) {
      await fetchPlayerTotalWins(address);
      console.log('Fetched total wins:', playerTotaWins); // Debugging line
      setTotalWins(playerTotaWins);
    } else {
      console.error('Address is not available');
    }
  };

  const handleFetchPlayerWinsLottery = async () => {
    if (address) {
      await fetchPlayerWinsLottery(address);
      console.log('Fetched lottery wins:', playerWinsLottery); // Debugging line
      setLotteryWins(playerWinsLottery);
    } else {
      console.error('Address is not available');
    }
  };

  const handleFetchPlayerWinsMiniGame = async () => {
    if (address) {
      await fetchPlayerWinsMiniGame(address);
      console.log('Fetched mini-game wins:', playerWinsMiniGame); // Debugging line
      setMiniGameWins(playerWinsMiniGame);
    } else {
      console.error('Address is not available');
    }
  };

  const handleFetchPlayerWinsNFTLottery = async () => {
    if (address) {
      await fetchPlayerWinsNFTLottery(address);
      console.log('Fetched NFT lottery wins:', playerWinsNFTLottery); // Debugging line
      setNftLotteryWins(playerWinsNFTLottery);
    } else {
      console.error('Address is not available');
    }
  };

  const handleFetchPlayerWinsMiniGameNFT = async () => {
    if (address) {
      await fetchPlayerWinsMiniGameNFT(address);
      console.log('Fetched MiniGame NFT wins:', playerWinsMiniGameNFT); // Debugging line
      setMiniGameNftWins(playerWinsMiniGameNFT);
    } else {
      console.error('Address is not available');
    }
  };

  return (
    <div className={Styles.statbox}>
      <div className={Styles.messages}>
        <button
          onClick={handleClick}
          style={{
            width: '50%', // Makes the button wider than its container
            height: '40%', // Makes the button taller than its container
            padding: '10px 10px',
            backgroundColor: 'transparent',
            color: '#C8AC53',
            fontSize: '20px',
            fontFamily: 'Monofonto',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'center',
            boxSizing: 'border-box',
            transformOrigin: 'center', // Optional: ensures the scaling is from the center
            cursor: 'url("/curs.png"), auto',
          }}
        >
          <div className={Styles.Button}>GET STATS</div>
        </button>
        {totalwins !== null && (
          <p>
            <span className={Styles.bigmessage}>TOTAL WINS: {totalwins}</span>
          </p>
        )}
        {wins !== null && (
          <p>
            <span className={Styles.message}>NFT WAGERS WON: {wins}</span>
          </p>
        )}
        {lotteryWins !== null && (
          <p>
            <span className={Styles.message}>LUCKY 69 WINS: {lotteryWins}</span>
          </p>
        )}
        {miniGameWins !== null && (
          <p>
            <span className={Styles.message}>BIGIRON WINS: {miniGameWins}</span>
          </p>
        )}
        {nftLotteryWins !== null && (
          <p>
            <span className={Styles.message}>LUCKY 69 NFT WINS: {nftLotteryWins}</span>
          </p>
        )}
        {miniGameNftWins !== null && (
          <p>
            <span className={Styles.message}>BIGIRON NFT WINS: {miniGameNftWins}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Nftduelwins;
