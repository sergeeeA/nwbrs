import React, { useEffect, useRef, useState } from 'react';
import style from '../styles/PotCard.module.css';
import { useAppContext } from '../context/context';

const PotCard = () => {
  const { address, duelnft, miniGameNFTTokenId, miniGameNFTfirstDepositor, lastMiniGameNFTWinner } = useAppContext();
  
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
            params: [{ chainId }], // Switch to the correct network
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

  // Determine if the "DUEL" button should be displayed or "UNAVAILABLE"
  const isMiniGameNFTAvailable = miniGameNFTTokenId > 0;
  const nftText = isMiniGameNFTAvailable ? 'BERA DWELLER' : 'NONE';
  const isDepositorLoaded = miniGameNFTfirstDepositor && miniGameNFTfirstDepositor !== '0x0000000000000000000000000000000000000000';
  const depositorStatusClass = isDepositorLoaded ? style.textLoaded : style.textNotLoaded;
  const depositorStatus = formatAddress(miniGameNFTfirstDepositor);

  // Update duel button state based on NFT presence
  useEffect(() => {
    setIsDuelDisabled(!isMiniGameNFTAvailable);
  }, [isMiniGameNFTAvailable]);

  // Format last winner address
  const lastWinnerStatus = formatAddress(lastMiniGameNFTWinner);

  const handleTitleClick = () => {
    window.location.href = 'https://bera-tec.gitbook.io/bera-tec/testnet-guide/new-beras/big-iron';
  };

  return (
    <div className={style.wrapper}>
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
          You cant duel again.
        </div>
      ) : (
        <div className={`${style.btn} ${isDuelDisabled ? style.btndisabled : ''}`} onClick={handleGambooolClick}>
          {isMiniGameNFTAvailable ? 'DUEL' : 'UNAVAILABLE'}
        </div>
      ))}
    </div>
  );
};

export default PotCard;
