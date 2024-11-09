import React, { useEffect, useRef, useState } from 'react';
import style from '../styles/PotCardPlayers.module.css';
import { useAppContext } from '../context/context';

const PotCard = () => {
  const { lotteryPlayers = [], fetchLotteryPlayers, address: connectedWalletAddress } = useAppContext();

  const [isSpinning, setIsSpinning] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);



  const formatAddress = (address) => {
    if (address === "0x0000000000000000000000000000000000000000") {
      return "None";
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const addressCount = lotteryPlayers.reduce((acc, player) => {
    acc[player] = (acc[player] || 0) + 1;
    return acc;
  }, {});

  // Sort the addresses, putting the connected wallet address at the top
  const sortedAddresses = Object.entries(addressCount).sort(([addressA], [addressB]) => {
    if (addressA === connectedWalletAddress) return -1;
    if (addressB === connectedWalletAddress) return 1;
    return 0; // Keep the original order for others
  });

  const handleRefreshClick = () => {
    if (isButtonDisabled) return;

    setIsSpinning(true);
    fetchLotteryPlayers();

    setTimeout(() => {
      setIsSpinning(false);
    }, 600);

    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 5000);
  };

  return (
    <div className={style.wrapper} >
      <div className={style.players}>
        <div className={style.rafflefee}>LUCKY 69 PLAYERS</div>
        <div className={`${style.lineAfter}`}></div>
        <div className={style.scrollableList}> {/* Scrollable list container */}
          {sortedAddresses.length > 0 ? (
            sortedAddresses.map(([address, count], index) => (
              <div key={index} className={style.rafflefee}>
                {address === connectedWalletAddress && <span className={style.you}>YOU</span>}
                {formatAddress(address)} 
                <span className={style.count}>({count})</span>
              </div>
            ))
          ) : (
            <div className={style.rafflefee}>No players in the lottery</div>
          )}
        </div>
     
      </div>
      <button 
        className={`${style.refreshButton} ${isSpinning ? style.spinning : ''}`} 
        onClick={handleRefreshClick} 
        aria-label="Refresh Players"
        disabled={isButtonDisabled}
      >
        ↻
      </button>
    </div>
  );
};

export default PotCard;
