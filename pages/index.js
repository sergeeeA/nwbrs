import { useState, useEffect } from 'react';
import Header from '../components/Header';

import PotCardC from '../components/PotCardC';
import PotCard from '../components/PotCard';


import Nftduel from '../components/Nftduel';

import Nftduelsecond from '../components/Nftduelsecond';
import Nftduelthird from '../components/Nftduelthird'; 
//nftduel history
import NftDuelhistory from '../components/NftDuelhistory'; 
import NftDuelhistorySecond from '../components/NftDuelhistorySecond'; 
import NftDuelhistoryThird from '../components/NftDuelhistoryThird'; 

//Revshare
import Revshare from '../components/Revshare'; 
//walletconect
import Connect from '../components/Connect';

import Nftduelstatus from '../components/Nftduelstatus';
import Nftduelstatussecond from '../components/Nftduelstatussecond';
import Nftduelstatusthird from '../components/Nftduelstatusthird';

import Stats from '../components/Stats';
import potCardsContainer from '../styles/potCardsContainer.module.css';
import homeStyle from '../styles/Home.module.css'; 
import { useAppContext } from '../context/context';
import { Wallet } from 'ethers';

export default function Home() {
  const { refreshData , fetchNFTPrizeThirdRounds, fetchAllNftPrizeSecondRounds, fetchAllNftPrizeRounds} = useAppContext();

  const [isRefreshing, setIsRefreshing] = useState(false); 
  const [isOpenA, setIsOpenA] = useState(false);
  const { 
    fetchLastWinner,
    fetchNftLastWinner,
    fetchLotteryBalance, 
    fetchUserList,
    lastWinner, nftTokenId, fetchNFTTokenId,
    lastNFTLotteryWinner,
    fetchLotteryPlayers, fetchNftLotteryPlayers,
  } = useAppContext();
  
  const [isFetchingStrip, setIsFetchingStrip] = useState(false);

  const [isNewTabOpen, setIsNewTabOpen] = useState(false); // New Tab for Revshare
  const [isLotteryOpen, setIsLotteryOpen] = useState(false); // Lottery section

  const [showPlayers, setShowPlayers] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false); 

  const [isDuelHistoryOpen, setIsDuelHistoryOpen] = useState(false);
  const [isDuelHistorySecondOpen, setIsDuelHistorySecondOpen] = useState(false);
  const [isDuelHistoryThirdOpen, setIsDuelHistoryThirdOpen] = useState(false);

  const [currentGroup, setCurrentGroup] = useState(1); // For NFT duel switch
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const [isWalletConnected, setIsWalletConnected] = useState(false);
   // Simulate wallet connection
   const connectWallet = () => {
    // Replace this with actual wallet connection logic
    setIsWalletConnected(true);
  };



  const fetchStripData = async () => {
    if (isFetchingStrip || (lastFetchTime && Date.now() - lastFetchTime < 20000)) {
      return; 
    }

    setIsFetchingStrip(true);
    setLastFetchTime(Date.now());

    console.log('>>>LOTTERY<<<');
    await fetchNFTTokenId();
    await fetchLotteryBalance();
  
    await fetchNftLastWinner();

    setIsFetchingStrip(false);
  };

  const toggleBTE = () => {
    if (!isNewTabOpen) {
      setIsOpenA(false);
      setIsStatsOpen(false); 
      setShowPlayers(false);
      setIsDuelHistoryOpen(false);
      setIsDuelHistorySecondOpen(false);
      setIsDuelHistoryThirdOpen(false);
      setIsLotteryOpen(false);
    }

    setIsNewTabOpen((prev) => !prev);  
  };

  const toggleLottery = () => {
    if (!isLotteryOpen) {
      // When lottery tab is opened, reset other sections
      setIsOpenA(false);
      setIsStatsOpen(false); 
      setShowPlayers(false);
      setIsDuelHistoryOpen(false);
      setIsDuelHistorySecondOpen(false);
      setIsDuelHistoryThirdOpen(false);
      setIsNewTabOpen(false);
      fetchStripData();  
    }

    setIsLotteryOpen((prev) => !prev);  // Toggle the lottery section visibility
  };

  const toggleOpenA = () => {
    
    setIsLotteryOpen(false);
    setIsStatsOpen(false); 
    setIsNewTabOpen(false); 
    setIsOpenA(true); // Open NFTduel components
  };

  const toggleDuelHistory = () => {
    setIsDuelHistoryOpen((prev) => !prev);
    fetchAllNftPrizeRounds();
    
  };
  const toggleDuelHistorySecond = () => {
    setIsDuelHistorySecondOpen((prev) => !prev);
    fetchAllNftPrizeSecondRounds();
  };
  const toggleDuelHistoryThird = () => {
    setIsDuelHistoryThirdOpen((prev) => !prev);
    fetchNFTPrizeThirdRounds();
  };

  const toggleStats = () => {
    setIsStatsOpen((prev) => !prev);
    if (!isStatsOpen) {
      setIsOpenA(false);
      setIsNewTabOpen(false); 
      setShowPlayers(false);
    }
  };

  const handleGroupSwitch = async (direction) => {
    if (direction === 'left') {
      setCurrentGroup((prev) => (prev === 0 ? 2 : prev - 1)); 
    } else if (direction === 'right') {
      setCurrentGroup((prev) => (prev === 2 ? 0 : prev + 1)); 
    }

    if (isRefreshing) return;

    setIsRefreshing(true);
  
    try {
      await refreshData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div>
      {/* Show WalletConnectBtn if wallet is not connected */}
      {!isWalletConnected && (
        <div className={homeStyle.walletConnectOverlay}>
          <Connect connectWallet={connectWallet} />
        </div>
      )}
      <div className={homeStyle.wrapper}>
        <Header 
          onToggleA={toggleOpenA} 
          toggleBTE={toggleBTE}
          toggleStats={toggleStats} 
          toggleLottery={toggleLottery}
        />

        {isNewTabOpen && (
          <div className={potCardsContainer.potCardsContainer}>
            <Revshare /> 
          </div>
        )}

        {/* Only show the content below if the new tab is not open */}
        {!isNewTabOpen && (
          <>
            {isStatsOpen ? (
              <Stats />
            ) : (
              <>
                {/* Lottery Section */}
                {isLotteryOpen && (
                  <div className={potCardsContainer.potCardsContainer}>
                  <div className={potCardsContainer.potCardsContainer}>
                    <PotCard />
       
                  
               

                  </div>
                  <div className={potCardsContainer.potCardsContainer}>
                    <PotCardC />
                    </div>
                    </div>
                )}


                {/* NFT Duel Group Display */}
                {isOpenA && (
                  <div className={homeStyle.wrapper}>
                    
                {/* Arrow Buttons */}
                <div className={potCardsContainer.potCardsContainer}>
                  <div className={homeStyle.arrowButtons}>
                    <button style={{ border: '1px solid transparent' }} onClick={() => handleGroupSwitch('left')}>←</button>
                    <button style={{ border: '1px solid transparent' }} onClick={() => handleGroupSwitch('right')}>→</button>
                  </div>
                </div>
                    <div className={homeStyle.sideBySideContainer}>
                      {/* Left Group */}
                      <div className={`${homeStyle.group} ${currentGroup === 0 ? homeStyle.activeGroup : homeStyle.inactiveGroup}`}>
                        <Nftduelstatussecond />
                        <Nftduelsecond />
                        <div className={homeStyle.nftDuelHistoryContainer}>
                          <div onClick={toggleDuelHistorySecond} className={homeStyle.toggleButton}>
                            {isDuelHistorySecondOpen ? '↑' : '↓'} DUEL HISTORY
                          </div>
                          <div className={`${homeStyle.dropdownContent} ${isDuelHistorySecondOpen ? homeStyle.open : homeStyle.closed}`}>
                            <NftDuelhistorySecond />
                          </div>
                        </div>
                      </div>

                      {/* Center Group */}
                      <div className={`${homeStyle.group} ${currentGroup === 1 ? homeStyle.activeGroup : homeStyle.inactiveGroup}`}>
                        <Nftduelstatus />
                        <Nftduel />
                        <div className={homeStyle.nftDuelHistoryContainer}>
                          <div onClick={toggleDuelHistory} className={homeStyle.toggleButton}>
                            {isDuelHistoryOpen ? '↑' : '↓'} DUEL HISTORY
                          </div>
                          <div className={`${homeStyle.dropdownContent} ${isDuelHistoryOpen ? homeStyle.open : homeStyle.closed}`}>
                            <NftDuelhistory />
                          </div>
                        </div>
                      </div>

                      {/* Right Group */}
                      <div className={`${homeStyle.group} ${currentGroup === 2 ? homeStyle.activeGroup : homeStyle.inactiveGroup}`}>
                        <Nftduelstatusthird />
                        <Nftduelthird />
                        <div className={homeStyle.nftDuelHistoryContainer}>
                          <div onClick={toggleDuelHistoryThird} className={homeStyle.toggleButton}>
                            {isDuelHistoryThirdOpen ? '↑' : '↓'} DUEL HISTORY
                          </div>
                          <div className={`${homeStyle.dropdownContent} ${isDuelHistoryThirdOpen ? homeStyle.open : homeStyle.closed}`}>
                            <NftDuelhistoryThird />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>

  );
}
