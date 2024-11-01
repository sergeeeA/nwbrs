import React, { useEffect, useRef, useState } from 'react';
import style from '../styles/PotCardPlayers.module.css';
import { useAppContext } from '../context/context';

const PotCard = () => {
  const {
    address: connectedWalletAddress,
    miniGameNFTRounds = [], // Use miniGameNFTRounds
    fetchAllMiniGameNFTRounds, // Fetch function for NFT rounds
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

  const formatAmount = (amountInWei) => {
    const amountInEth = amountInWei / 1e18;
    return amountInEth.toFixed(2); // Format to 2 decimal places
  };

  const handleRefreshClick = () => {
    if (isButtonDisabled) return;

    setIsSpinning(true);
    fetchAllMiniGameNFTRounds(); // Refresh NFT rounds

    setTimeout(() => {
      setIsSpinning(false);
    }, 600);

    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 5000);
  };

  const filteredRounds = showOnlyConnected
    ? miniGameNFTRounds.filter(round => round.winner === connectedWalletAddress || round.loser === connectedWalletAddress)
    : miniGameNFTRounds;

  useEffect(() => {
    const card = cardRef.current;

    const handleMouseMove = (e) => {
      const { clientWidth: width, clientHeight: height } = card;
      const { offsetX: x, offsetY: y } = e;

      const centerX = width / 2;
      const centerY = height / 2;
      const deltaX = x - centerX;
      const deltaY = y - centerY;
      const normalizedX = deltaX / centerX;
      const normalizedY = deltaY / centerY;
      const maxTiltX = 20;
      const maxTiltY = 10;
      const tiltX = normalizedX * maxTiltX;
      const tiltY = -normalizedY * maxTiltY;

      card.style.transform = `rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale(1.05)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className={style.wrapper} ref={cardRef}>
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
                  <span style={{ margin: '5px' }}>{formatAmount(round.amountWon)} BERA / NFT</span>
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
