import React, { useState, useEffect } from 'react';
import style from '../styles/PotCard.module.css'; 
import { useAppContext } from '../context/context';
import Web3 from 'web3';

const PotCard = () => {
  const { lotteryPot, enterLottery, lastWinner,fetchLastWinner, lotteryPlayers = [], fetchLotteryPlayers, address: connectedWalletAddress } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [canFetch, setCanFetch] = useState(true);

  // Initialize Web3 instance
  const web3 = new Web3(Web3.givenProvider || "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID");

  // Handle fetching data only when dropdown is opened and cooldown has passed
  const fetchData = async () => {
    setIsFetching(true);
    await fetchLotteryPlayers();
    await fetchLastWinner();
    setIsFetching(false);
    setCanFetch(false);
    setTimeout(() => {
      setCanFetch(true); // Enable fetch after 10 seconds
    }, 10000);
  };

  useEffect(() => {
    if (isDropdownOpen && !isFetching && canFetch) {
      fetchData();
    }
  }, [isDropdownOpen, isFetching, canFetch]);

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
    setLoading(true); 
    await handleSwitchNetwork();
    await enterLottery();
    setLoading(false);
  };

  const handleTitleClick = () => {
    window.location.href = 'https://bera-tec.gitbook.io/bera-tec/testnet-guide/new-beras/lucky-69';
  };

  const formatAddress = (address) => {
    if (!address || typeof address !== 'string') {
      return "...";  // Return a fallback if it's not a valid address string
    }
  
    if (address === "0x0000000000000000000000000000000000000000") {
      return "None";  // Special case for the zero address
    }
  
    return `${address.slice(0, 6)}...${address.slice(-4)}`;  // Format address
  };

  const addressCount = lotteryPlayers.reduce((acc, player) => {
    acc[player] = (acc[player] || 0) + 1;
    return acc;
  }, {});

  const sortedAddresses = Object.entries(addressCount).sort(([addressA], [addressB]) => {
    if (addressA === connectedWalletAddress) return -1;
    if (addressB === connectedWalletAddress) return 1;
    return 0;
  });

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // WEI To ETH CONVersion
  const formatAmountWon = (amountInWei) => {
    return web3.utils.fromWei(amountInWei, 'ether'); 
  };

  return (
    <div className={style.wrapper}>
      <div className={style.title} onClick={handleTitleClick}>
        LOTTERY
      </div>


      
      <div className={style.pot}>
        PRIZE: <span className={style.goldAccent}>{lotteryPot} BERA</span>
      </div>

      <div className={style.rafflefee}>
        <div className={style.btn} onClick={toggleDropdown}>
          {isDropdownOpen ? '▲' : '▼'} DETAILS
        </div>
      </div>

      {isDropdownOpen && (
        
        <div className={style.dropdownContent}>
 
          
          <div className={style.rafflefee}>
            LAST WINNER: 
            <span className={style.rafflefee}>
              {lastWinner.winnerAddress ? formatAddress(lastWinner.winnerAddress) : "No winner yet"}
            </span>
          
             ( {lastWinner.amountWon > 0 ? `${formatAmountWon(lastWinner.amountWon)} BERA` : ""} )
         
          </div>

          <div className={style.playersContainer}>

          
          <div className={style.scrollableList}>
  {sortedAddresses.length > 0 ? (
    sortedAddresses.map(([address, count], index) => {
      // Calculate the percentage for each address
      const percentage = ((count / lotteryPlayers.length) * 100).toFixed(2);

      return (
        <li key={index} className={style.Detailscontents}>
          {address === connectedWalletAddress && <span className={style.you}>YOU</span>}
          {formatAddress(address)}
          <span className={style.count}>({percentage}%)</span>
        </li>
      );
    })
  ) : (
    <div className={style.Detailscontents}>No players in the lottery</div>
  )}
</div>
          </div>
        </div>
      )}

      {loading ? (
        <div className={`${style.loading} ${loading ? style.visible : ''}`}>
          <div className={style.loadingText}>Please wait for your transaction</div>
          <div className={style.loadingCircle}></div>
        </div>
      ) : (
        <div 
          className={style.btn} 
          onClick={handleGambooolClick}
          title="0.25 BERA"
        >
          ENTER
        </div>
      )}
    </div>
  );
};

export default PotCard;
