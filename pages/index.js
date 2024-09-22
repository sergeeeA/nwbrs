import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import PotCardA from '../components/PotCardA';
import PotCardB from '../components/PotCardB';
import PotCardC from '../components/PotCardC';
import PotCard from '../components/PotCard';
import Footer from '../components/Footer';
import Nftduel from '../components/Nftduel';
import Nftduelsecond from '../components/Nftduelsecond';
import Nftduelthird from '../components/Nftduelthird'; 
import Nftduelwins from '../components/Nftduelwins';
import Nftduelstatus from '../components/Nftduelstatus';
import Leaderboard from '../components/Leaderboard';
import Nftduelstatussecond from '../components/Nftduelstatussecond';
import Nftduelstatusthird from '../components/Nftduelstatusthird';
import Inventory from '../components/Inventory';

import potCardsContainer from '../styles/potCardsContainer.module.css'; // style //
import homeStyle from '../styles/Home.module.css'; // style //

export default function Home() {
  const [isOpenA, setIsOpenA] = useState(false);
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false); // New state for leaderboard
  const [isOpenNftduel, setIsOpenNftduel] = useState(false);
  const [isNftduelwinsOpen, setIsNftduelwinsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('duel'); 
  const [activeButton, setActiveButton] = useState('duel'); // Track active button
  const backgroundRef = useRef(null);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setActiveButton(page); // Set the active button
  };

  const toggleOpenA = () => {
    setIsOpenA(!isOpenA);
    setIsOpenNftduel(false);
  };

  const toggleOpenNftduel = () => {
    setIsOpenNftduel(!isOpenNftduel);
    setIsOpenA(false);
  };

  const toggleChatbox = () => {
    setIsChatboxOpen(!isChatboxOpen);
  };

  const toggleLeaderboard = () => {
    setIsLeaderboardOpen(!isLeaderboardOpen); // Toggle leaderboard visibility
  };

  const toggleNftduelwins = () => {
    setIsNftduelwinsOpen(!isNftduelwinsOpen);
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (backgroundRef.current && !(isOpenA || isOpenNftduel)) {
        const x = event.clientX / window.innerWidth;
        const y = event.clientY / window.innerHeight;
        backgroundRef.current.style.backgroundPosition = `${x * 1000}px ${y * 500}px, 
                                                          ${x * 100}px ${y * 25}px, 
                                                          ${x * 75}px ${y * 25}px, 
                                                          ${x * 50}px ${y * 25}px, 
                                                          ${x * 25}px ${y * 7.5}px`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isOpenA, isOpenNftduel]);

  return (
    <div>
      <div
        ref={backgroundRef}
        className={homeStyle.background}
        style={{ visibility: isOpenA || isOpenNftduel ? 'hidden' : 'visible' }}
      ></div>
      <div className={homeStyle.wrapper}>
        <Header 
          onToggleA={toggleOpenA} 
          onToggleNftduel={toggleOpenNftduel} 
          isOpenA={isOpenA} 
          isOpenNftduel={isOpenNftduel} 
        />
        
        <button
          className={homeStyle.statsboxToggleButton}
          onClick={toggleNftduelwins}
        >
          {isNftduelwinsOpen ? 'WALLET STATS' : 'WALLET STATS'}
        </button>

        {isNftduelwinsOpen && <Nftduelwins />}

        <button
          className={homeStyle.chatboxToggleButton}
          onClick={toggleChatbox}
        >
          {isChatboxOpen ? 'NFT INVENTORY' : 'NFT INVENTORY'}
        </button>

        {isChatboxOpen && <Inventory />}

        <button
          className={homeStyle.boardboxToggleButton}
          onClick={toggleLeaderboard}
        >
          {isLeaderboardOpen ? 'CLOSE LEADERBOARD' : 'OPEN LEADERBOARD'}
        </button>

        {isLeaderboardOpen && <Leaderboard />}

        {isOpenNftduel && (
          <div className={homeStyle.potCardsContainer}>
            <div 
              className={homeStyle.pageSelection} 
              style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}
            >
              <div className={homeStyle.buttonContainer}>
                <button 
                  onClick={() => handlePageChange('duel')} 
                  className={`${homeStyle.nftduelbutton} ${activeButton === 'duel' ? homeStyle.active : ''}`}
                >
                  BERA DWELLERS
                </button>
                <button 
                  onClick={() => handlePageChange('second')} 
                  className={`${homeStyle.nftduelbuttonmon} ${activeButton === 'second' ? homeStyle.active : ''}`}
                >
                  BERAMONIUM
                </button>
                <button 
                  onClick={() => handlePageChange('third')} 
                  className={`${homeStyle.nftduelbuttonarena} ${activeButton === 'third' ? homeStyle.active : ''}`}
                >
                  BEAR ARENA
                </button>
              </div>
            </div>

            {currentPage === 'duel' ? (
              <>
                <Nftduelstatus /> 
                <Nftduel />
              </>
            ) : currentPage === 'second' ? (
              <>
                <Nftduelstatussecond />
                <Nftduelsecond />
              </>
            ) : (
              <>
                <Nftduelstatusthird />
                <Nftduelthird />
              </>
            )}
          </div>
        )}

        <div className={`${potCardsContainer.potCardsContainer} ${isOpenA ? potCardsContainer.open : potCardsContainer.closed}`}>
          <PotCard />
          <PotCardC />
        </div>

        <div className={`${potCardsContainer.potCardsContainer} ${isOpenA ? potCardsContainer.open : potCardsContainer.closed}`}>
          <PotCardB />
          <PotCardA />
        </div>

        <Footer />
      </div>
    </div>
  );
}
