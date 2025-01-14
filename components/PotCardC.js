import React, { useEffect, useState, useRef } from 'react';
import style from '../styles/PotCard.module.css';
import { useAppContext } from '../context/context';

const PotCard = () => {
  const { miniGamePool, enterNFT, nftTokenId, lastNFTLotteryWinner, nftLotteryPlayers = [], fetchNftLotteryPlayers, address: connectedWalletAddress } = useAppContext();

  const [loading, setLoading] = useState(false); // Added loading state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown open
  const [isFetching, setIsFetching] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0); // To manage cooldown
  const cardRef = useRef(null);
  const [canFetch, setCanFetch] = useState(true); //CooLdown for data fecthing

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

  // Count occurrences of each address (for Component B logic)
  const addressCount = nftLotteryPlayers.reduce((acc, player) => {
    acc[player] = (acc[player] || 0) + 1;
    return acc;
  }, {});

  // Sort the addresses, putting the connected wallet address at the top
  const sortedAddresses = Object.entries(addressCount).sort(([addressA], [addressB]) => {
    if (addressA === connectedWalletAddress) return -1;
    if (addressB === connectedWalletAddress) return 1;
    return 0; // Keep the original order for others
  });

  const fetchData = async () => {
    const currentTime = Date.now();
    if (isDropdownOpen && currentTime - lastFetchTime > 30000) {
      setIsFetching(true);
      await fetchNftLotteryPlayers(); // Fetch lottery players
      setLastFetchTime(currentTime); // Update last fetch time
      setIsFetching(false); // Reset fetching state
    }
  };

  const handleRefreshClick = () => {
    if (canFetch) {

      fetchNftLotteryPlayers(); // Refresh mini game rounds




      // Set the cooldown to prevent further calls for 10 seconds
      setCanFetch(false);
      setTimeout(() => {
        setCanFetch(true); // Enable fetching again after 10 seconds
      }, 10000); // 10-second cooldown
    }
  };


  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false); // Close the dropdown
  };

  return (
    <div className={style.wrapper}>
      <div className={`${style.title}`} onClick={handleTitleClick}>
        NFT LOTTERY
      </div>


      
      <div className={`${style.pot}`}>
        PRIZE: <span className={nftText === 'NONE' ? style.textNotLoaded : style.goldAccent}>{nftText}</span>
      </div>
      {/* Dropdown Button for Players */}
      <div className={style.rafflefee}>
        <div className={style.btn} 
          onClick={() => {
            handleRefreshClick(); // Trigger refresh on hover
            toggleDropdown(true); // Open dropdown on hover
          }}>
          {isDropdownOpen ? '▲' : '▼'} DETAILS
        </div>
      </div>

      {isDropdownOpen && (
        <div className={style.dropdownContent}>
       
          <div className={style.rafflefee}>
        LAST WINNER: <span className={style.winnerName}>{lastWinnerStatus}</span>
      </div>
     <div className={style.playersContainer}>

     <div className={style.scrollableList}> {/* Scrollable list container */}
  {sortedAddresses.length > 0 ? (
    sortedAddresses.map(([address, count], index) => {
      // Calculate the percentage for each address
      const percentage = ((count / nftLotteryPlayers.length) * 100).toFixed(2);

      return (
        <div key={index} className={style.Detailscontents}>
          {address === connectedWalletAddress && <span className={style.you}>YOU</span>}
          {formatAddress(address)} <span className={style.count}>({percentage}%)</span>
        </div>
      );
    })
  ) : (
    <div className={style.rafflefee}>No players in the NFT lottery</div>
  )}
</div>
        </div>
      </div>
      )}

      {loading ? (
        <div className={`${style.loading} ${loading ? style.visible : ''}`}>


        <div className={style.loadingText}>Please wait for your transaction</div>
        <div className={style.container}><div className={style.loadingCircle}></div></div>
      </div>
      ) : (
        <div title="0.25 BERA" className={`${style.btn} ${!isNFTAvailable ? style.btndisabled : ''}`} onClick={handleGambooolClick}>
          {isNFTAvailable ? 'ENTER' : 'UNAVAILABLE'}
        </div>
      )}
      </div>
      
  );
};

export default PotCard;
