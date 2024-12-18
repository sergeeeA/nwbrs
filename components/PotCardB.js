import React, { useEffect, useRef, useState } from 'react';
import style from '../styles/PotCard.module.css';
import { useAppContext } from '../context/context';

const PotCard = () => {
  const { miniGamePool, duel, firstDepositor, lastMiniGameWinner, address} = useAppContext();

  const [loading, setLoading] = useState(false);

  // Helper function to format Ethereum address
  const formatAddress = (address) => {
    if (!address || address === '0x0000000000000000000000000000000000000000') return 'NO PLAYER';
    if (address.length <= 10) return address; // If the address is already short, return it as is
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

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
    await duel(); // Ensure duel is awaited if it's a promise
    setLoading(false); // End loading
  };

  // Determine the class and text based on miniGamePool value
  const isLoaded = miniGamePool > 0;
  const potClass = isLoaded ? `${style.textNotLoaded} ${style.textLoaded}` : style.pot;

  // Determine class and text based on firstDepositor value
  const depositorClass = firstDepositor === '0x0000000000000000000000000000000000000000' ? style.textNotLoaded : style.textLoaded;
  const depositorText = formatAddress(firstDepositor) || 'Loading...';

  

  // Link
  const handleTitleClick = () => {
    window.location.href = 'https://bera-tec.gitbook.io/bera-tec/testnet-guide/new-beras/big-iron'; // Replace with your target URL
  };
  return (
    <div className={style.wrapper} >
      <div className={`${style.titlebigironbg}`}>
        <div className={`${style.titleBigiron}`} onClick={handleTitleClick}>
          BIG IRON
        </div>
      </div>
  
      <div className={depositorClass}>
        {depositorText}
      </div>
  
      <div className={style.pot}>
        <span className={style.potLabel}>PRIZE:</span> <span className={potClass}>{miniGamePool}</span>
      </div>
  
      <div className={style.rafflefeebg}>
        <div className={style.rafflefee}>
          Duel Wager: 1
        </div>
      </div>
      <div className={style.rafflefee}>
        LAST WINNER: {formatAddress(lastMiniGameWinner)}
      </div>
      <div className={`${style.lineAfter}`}></div>
  
      {loading ? (
        <div className={`${style.loading} ${loading ? style.visible : ''}`}>
          <div className={style.loadingCircle}></div>
        </div>
      ) : (address === firstDepositor ? (
        <div className={style.rafflefee}>
          You cant duel again.
        </div>
      ) : (
        <div className={`${style.btn}`} onClick={handleGambooolClick}>
          DUEL
        </div>
      ))}
    </div>
  );
  
};

export default PotCard;
