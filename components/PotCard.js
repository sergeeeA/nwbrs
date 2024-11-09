import React, { useEffect, useRef, useState } from 'react';
import style from '../styles/PotCard.module.css';
import { useAppContext } from '../context/context';

const PotCard = () => {
  const { lotteryPot, enterLottery, lastWinner } = useAppContext();

  const [loading, setLoading] = useState(false); // Added loading state


  const handleSwitchNetwork = async () => {
    try {
      const chainId = '0x138D4'; // Chain ID 80084 in hexadecimal

      if (window.ethereum) {
        const provider = window.ethereum;
        const currentChainId = await provider.request({ method: 'eth_chainId' });

        if (currentChainId !== chainId) {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId }],
          });
        }
      } else {
        console.error('MetaMask is not installed');
      }
    } catch (error) {
      console.error('Failed to switch network', error);
    }
  };

  const handleGambooolClick = async () => {
    setLoading(true); // Start loading
    await handleSwitchNetwork();
    await enterLottery(); // Ensure enterLottery is awaited if it's a promise
    setLoading(false); // End loading
  };

  const handleTitleClick = () => {
    window.location.href = 'https://bera-tec.gitbook.io/bera-tec/testnet-guide/new-beras/lucky-69'; // Replace with your target URL
  };

  const formatAddress = (address) => {
    if (address === "0x0000000000000000000000000000000000000000") {
      return "None";
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className={style.wrapper} >
      <div className={`${style.titlebglucky69bg}`}>
        <div className={`${style.title}`} onClick={handleTitleClick}>
          LUCKY 69
        </div>
      </div>

      <div className={`${style.pot}`}>
        PRIZE: <span className={style.goldAccent}>{lotteryPot} BERA</span>
      </div>

      <div className={`${style.rafflefeebg}`}>
        <div className={`${style.rafflefee}`}>RAFFLE FEE: 0.25 BERA</div>
      </div>

      <div className={style.rafflefee}>
        LAST WINNER: <span className={style.winnerName}>{formatAddress(lastWinner)}</span>
      </div>

      <div className={`${style.lineAfter}`}></div>

      {loading ? (
        <div className={`${style.loading} ${loading ? style.visible : ''}`}>
          <div className={style.loadingCircle}></div>
        </div>
      ) : (
        <div className={style.btn} onClick={handleGambooolClick}>
          ENTER
        </div>
        
      )}
      
    </div>
  );
};

export default PotCard;
