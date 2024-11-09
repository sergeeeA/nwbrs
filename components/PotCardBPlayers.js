import React, { useEffect, useRef, useState } from 'react';
import style from '../styles/PotCardPlayers.module.css';
import { useAppContext } from '../context/context';

const PotCard = () => {
  const {
    address: connectedWalletAddress,
    miniGameRounds = [],
    fetchAllMiniGameRounds,
  } = useAppContext();


  const [isSpinning, setIsSpinning] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showOnlyConnected, setShowOnlyConnected] = useState(false); // New state for filtering

  const formatAddress = (address) => {
    if (address === "0x0000000000000000000000000000000000000000") {
      return "None";
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatAmount = (amountInWei) => {
    const amountInEth = amountInWei / 1e18;
    return amountInEth.toFixed(2); // Format to 2 decimal places
  };

  const handleRefreshClick = () => {
    if (isButtonDisabled) return;

    setIsSpinning(true);
    fetchAllMiniGameRounds(); // Refresh mini game rounds

    setTimeout(() => {
      setIsSpinning(false);
    }, 600);

    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 5000);
  };

  const filteredRounds = showOnlyConnected
    ? miniGameRounds.filter(round => round.winner === connectedWalletAddress || round.loser === connectedWalletAddress)
    : miniGameRounds;

  
  return (
    <div className={style.wrapper} >
      <div className={style.players}>
        <div className={style.rafflefee}>GAME HISTORY</div>
        <div 
          className={style.btn} 
          onClick={() => setShowOnlyConnected(prev => !prev)} // Toggle filter
        >
          {showOnlyConnected ? 'Show All' : 'Show My Games'}
        </div>
        <div className={`${style.lineAfter}`}></div>
        <div className={style.scrollableList}>
          {filteredRounds.length > 0 ? (
            [...filteredRounds].reverse().map((round, index) => ( // Reverse the order here
              <div key={index} className={style.smolwords}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#FF073A', marginRight: '5px' }}>{formatAddress(round.loser)}</span>
                  <span style={{ color: '#C8AC53' }}>VS</span>
                  <span style={{ color: '#39FF14', marginLeft: '5px' }}>{formatAddress(round.winner)}</span>
                  <span style={{ margin: '5px' }}>{formatAmount(round.amountWon)} BERA</span>
                </div>
              </div>
            ))
          ) : (
            <div className={style.rafflefee}>No games have been played</div>
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
