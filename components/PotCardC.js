import React, { useEffect, useState } from 'react';
import style from '../styles/PotCard.module.css';
import { useAppContext } from '../context/context';

const PotCard = () => {
  const { miniGamePool, enterNFT, nftTokenId, lastNFTLotteryWinner } = useAppContext();

  const [loading, setLoading] = useState(false); // Added loading state

  // Helper function to format Ethereum address
  const formatAddress = (address) => {
    if (!address || address === '0x0000000000000000000000000000000000000000') return '...';
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
    setLoading(true); // Start loading
    await handleSwitchNetwork();
    await enterNFT(); // Ensure enterNFT is awaited if it's a promise
    setLoading(false); // End loading
  };

  // Check if the NFT is available (nftTokenId > 1)
  const isNFTAvailable = nftTokenId > 1;
  const nftText = isNFTAvailable ? 'BERA DWELLER' : 'NONE';
  const lastWinnerStatus = formatAddress(lastNFTLotteryWinner);

  const handleTitleClick = () => {
    window.location.href = 'https://bera-tec.gitbook.io/bera-tec/testnet-guide/new-beras/lucky-69'; // Replace with your target URL
  };

  return (
    <div className={style.wrapper}>
      <div className={`${style.bierramadrebg}`}>
        <div className={`${style.title}`} onClick={handleTitleClick}>
          LUCKY 69 NFT
        </div>
      </div>

      <div className={`${style.pot}`}>
        NFT: <span className={nftText === 'NONE' ? style.textNotLoaded : style.goldAccent}>{nftText}</span>
      </div>

      <div className={`${style.rafflefeebg}`}>
        <div className={`${style.rafflefee}`}>RAFFLE FEE: 0.25 BERA</div>
      </div>
      <div className={style.rafflefee}>
        LAST WINNER: <span className={style.winnerName}>{lastWinnerStatus}</span>
      </div>
      <div className={`${style.lineAfter}`}></div>

      {loading ? (
        <div className={`${style.loading} ${loading ? style.visible : ''}`}>
          <div className={style.loadingCircle}></div>
        </div>
      ) : (
        <div className={`${style.btn} ${!isNFTAvailable ? style.btndisabled : ''}`} onClick={handleGambooolClick}>
          {isNFTAvailable ? 'ENTER' : 'UNAVAILABLE'}
        </div>
      )}
    </div>
  );
};

export default PotCard;
