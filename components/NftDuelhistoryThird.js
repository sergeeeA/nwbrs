import React, { useEffect, useRef, useState } from 'react';
import style from '../styles/Nftduelhistory.module.css';
import { useAppContext } from '../context/context';

const PotCard = () => {
  const {
    address: connectedWalletAddress,
    nftPrizeThirdRounds = { addresses1: [], addresses2: [] }, // Default to empty arrays
    fetchNFTPrizeThirdRounds, // Fetch function for NFT prize third rounds
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
    fetchNFTPrizeThirdRounds(); // Refresh NFT prize third rounds

    setTimeout(() => {
      setIsSpinning(false);
    }, 600);

    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 5000);
  };

  // Combine both address arrays into one, with winners and losers
  const combinedRounds = [];
  nftPrizeThirdRounds.addresses1.forEach((address, index) => {
    combinedRounds.push({
      winner: address,
      loser: nftPrizeThirdRounds.addresses2[index] || "None",
    });
  });

  const filteredRounds = showOnlyConnected
    ? combinedRounds.filter(round => round.winner === connectedWalletAddress || round.loser === connectedWalletAddress)
    : combinedRounds;

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
