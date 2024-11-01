import React, { useEffect, useRef, useState } from 'react';
import style from '../styles/PotCard.module.css';
import { useAppContext } from '../context/context';

const PotCard = () => {
  const {address, duelnft, miniGameNFTTokenId, miniGameNFTfirstDepositor, lastMiniGameNFTWinner } = useAppContext();
  const cardRef = useRef(null);

  // State to track whether the button is disabled and for loading state
  const [isDuelDisabled, setIsDuelDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // Helper function to format Ethereum address
  const formatAddress = (address) => {
    if (!address || address === '0x0000000000000000000000000000000000000000') return 'NO PLAYER';
    if (address.length <= 10) return address;
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
    if (isDuelDisabled) return; // Prevent action if disabled
    setLoading(true); // Start loading
    await handleSwitchNetwork();
    await duelnft(); // Ensure duel is awaited if it's a promise
    setLoading(false); // End loading
  };

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
      const maxTiltY = 20;
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

  const nftText = miniGameNFTTokenId > 0 ? 'BERA DWELLER' : 'NONE';
  const isDepositorLoaded = miniGameNFTfirstDepositor && miniGameNFTfirstDepositor !== '0x0000000000000000000000000000000000000000';
  const depositorStatusClass = isDepositorLoaded ? style.textLoaded : style.textNotLoaded;
  const depositorStatus = formatAddress(miniGameNFTfirstDepositor);

  // Update duel button state based on NFT presence
  useEffect(() => {
    setIsDuelDisabled(nftText === 'NONE');
  }, [nftText]);

  // Format last winner address
  const lastWinnerStatus = formatAddress(lastMiniGameNFTWinner);

  const handleTitleClick = () => {
    window.location.href = 'https://bera-tec.gitbook.io/bera-tec/testnet-guide/new-beras/big-iron';
  };

  return (
    <div className={style.wrapper} ref={cardRef}>
      <div className={style.titlebigironnftbg}>
        <div className={style.titleBigiron} onClick={handleTitleClick}>
          BIG IRON NFT
        </div>
      </div>
  
      <div className={`${style.depositorStatus} ${depositorStatusClass}`}>
        {depositorStatus}
      </div>
  
      <div className={style.pot}>
        NFT: <span className={nftText === 'NONE' ? style.textNotLoaded : style.goldAccent}>{nftText}</span>
      </div>
  
      <div className={style.rafflefeebg}>
        <div className={style.rafflefee}>
          Duel Wager: 1
        </div>
      </div>
      <div className={style.rafflefee}>
        LAST WINNER: <span className={style.winnerName}>{lastWinnerStatus}</span>
      </div>
      <div className={style.lineAfter}></div>
  
      {loading ? (
        <div className={`${style.loading} ${loading ? style.visible : ''}`}>
          <div className={style.loadingCircle}></div>
        </div>
      ) : (miniGameNFTfirstDepositor === address ? (
        <div className={style.rafflefee}>
          You can't duel again.
        </div>
      ) : (
        <div className={`${style.btnbigiron} ${isDuelDisabled ? style.disabled : ''}`} onClick={handleGambooolClick}>
          DUEL
        </div>
      ))}
    </div>
  );
  
};

export default PotCard;
