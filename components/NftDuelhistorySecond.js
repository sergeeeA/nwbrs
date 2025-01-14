import React, { useEffect, useRef, useState } from 'react';
import style from '../styles/Nftduelhistory.module.css';
import { useAppContext } from '../context/context';

const PotCard = () => {
  const {
    address: connectedWalletAddress,
    nftPrizeSecondRounds = { addresses1: [], addresses2: [] }, // Ensure defaults are empty arrays for addresses1 and addresses2
    fetchAllNftPrizeSecondRounds, // Fetch function for NFT prize second rounds
  } = useAppContext();

  const cardRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showOnlyConnected, setShowOnlyConnected] = useState(false); // New state for filtering

  const formatAddress = (address) => {
    if (address === "0x0000000000000000000000000000000000000000") {
      return "None";
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleRefreshClick = () => {
    if (isButtonDisabled) return;

    setIsSpinning(true);
    fetchAllNftPrizeSecondRounds(); // Refresh NFT prize second rounds

    setTimeout(() => {
      setIsSpinning(false);
    }, 600);

    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 5000);
  };

  // Ensure addresses1 and addresses2 exist and are arrays
  const addresses1 = nftPrizeSecondRounds?.addresses1 || [];
  const addresses2 = nftPrizeSecondRounds?.addresses2 || [];

  // Combine addresses1 and addresses2 into a list of rounds for easier display
  const rounds = addresses1.map((address1, index) => {
    return {
      winner: address1,
      loser: addresses2[index] || "0x0000000000000000000000000000000000000000", // Default value for missing losers
    };
  });

  // Filter rounds based on the "Show My Games" option
  const filteredRounds = showOnlyConnected
    ? rounds.filter(round => round.winner === connectedWalletAddress || round.loser === connectedWalletAddress)
    : rounds;

  return (
    <div className={style.wrapper}>
      <div className={style.centeredContainer}>
        <div className={style.players}>
          <div className={style.rafflefee}>GAME HISTORY</div>
          <div 
            className={style.btn} 
            onClick={() => setShowOnlyConnected(prev => !prev)} // Toggle filter
          >
            {showOnlyConnected ? 'Show All' : 'Show My Games'}
          </div>
  
          <div className={style.scrollableList}>
            {filteredRounds.length > 0 ? (
              [...filteredRounds].reverse().map((round, index) => ( // Reverse the order here
                <div key={index} className={style.smolwords}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#FF073A', marginRight: '5px' }}>{formatAddress(round.loser)}</span>
                    <span style={{ color: '#C8AC53' }}>VS</span>
                    <span style={{ color: '#39FF14', marginLeft: '5px' }}>{formatAddress(round.winner)}</span>
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
    </div>
  );
};

export default PotCard;
