import { useState, useEffect } from 'react';
import Header from '../components/Header';
import PotCardA from '../components/PotCardA';
import PotCardB from '../components/PotCardB';
import PotCardC from '../components/PotCardC';
import PotCard from '../components/PotCard';
import PotCardPlayers from '../components/PotCardPlayers';
import PotCardNFTPlayers from '../components/PotCardNFTPlayers';
import Footer from '../components/Footer';
import Nftduel from '../components/Nftduel';

import Nftduelsecond from '../components/Nftduelsecond';
import Nftduelthird from '../components/Nftduelthird'; 
//nftduel history
import NftDuelhistory from '../components/NftDuelhistory'; 
import NftDuelhistorySecond from '../components/NftDuelhistorySecond'; 
import NftDuelhistoryThird from '../components/NftDuelhistoryThird'; 
//claim
import Claim from '../components/Claim'; 

//this is big iron history
import PotCardAPlayers from '../components/PotCardAPlayers';
import PotCardBPlayers from '../components/PotCardBPlayers';

import Nftduelstatus from '../components/Nftduelstatus';
import Nftduelstatussecond from '../components/Nftduelstatussecond';
import Nftduelstatusthird from '../components/Nftduelstatusthird';
import KOTH from '../components/KOTH';
import KOTHLeader from '../components/KOTHLeader';
import Inventory from '../components/Inventory';
import Stats from '../components/Stats';
import potCardsContainer from '../styles/potCardsContainer.module.css';
import homeStyle from '../styles/Home.module.css'; 

const translations = ['Welcome', '欢迎', 'Willkommen', 'Добро пожаловать', 'いらっしゃいませ', 'स्वागत है', 'Bienvenido', '🐻⛓️'];

export default function Home() {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [targetText, setTargetText] = useState(translations[0]);
  const [isGlowing, setIsGlowing] = useState(false);
  
  const [isOpenA, setIsOpenA] = useState(false);
  const [isOpenNftduel, setIsOpenNftduel] = useState(false);
  const [isOpenKoth, setIsOpenKoth] = useState(false);
  const [currentPage, setCurrentPage] = useState('duel'); 
  const [activeButton, setActiveButton] = useState('duel');
  const [showPlayers, setShowPlayers] = useState(false);
  const [showGroupAPlayers, setShowGroupAPlayers] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false); // State for Stats visibility
  const [showInventory, setShowInventory] = useState(false);
  const [isDuelHistoryOpen, setIsDuelHistoryOpen] = useState(false);
  const [isDuelHistorySecondOpen, setIsDuelHistorySecondOpen] = useState(false);
  const [isDuelHistoryThirdOpen, setIsDuelHistoryThirdOpen] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % translations.length);
      setTargetText(translations[(currentIndex + 1) % translations.length]);
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    const changeText = () => {
      let index = 0;
      const targetLength = targetText.length;
      const interval = setInterval(() => {
        if (index < targetLength) {
          const targetChar = targetText[index];
          const charSet = getSimilarCharacters(targetChar);
          const randomChar = charSet[Math.floor(Math.random() * charSet.length)];

          setDisplayText((prev) => 
            prev.substring(0, index) + randomChar + prev.substring(index + 1)
          );
          index++;
        } else {
          clearInterval(interval);
          setDisplayText(targetText);
          setIsGlowing(true);
        }
      }, 50);
    };

    changeText();
  }, [targetText]);

  const getSimilarCharacters = (char) => {
    const similarChars = {
      'W': ['W', 'V', 'U', 'M', '你'],
      'e': ['e', '3', 'é', 'ë', 'ê', '好'],
      'l': ['l', '1', 'i', '|', '鱼'],
      'o': ['o', '0', 'ô', 'ö', 'ʕ•ᴥ•ʔ'],
      'c': ['c', 'k', 's', '🧸'],
      'a': ['a', '4', '@','🐻'],
      's': ['s', '5', '$' , '🐻⛓️'],
      't': ['t', '7', '+'],
      '0': ['0', 'O', 'o'],
      '1': ['1', 'l', 'I', '-'],
      '5': ['5', 'S', 's','%'],
      '2': ['2', 'Z', 'z'],
    };
    return similarChars[char] || [char];
  };

  const toggleOpenKoth = () => {
    setIsOpenKoth(!isOpenKoth);
    setIsOpenA(false);
    setIsOpenNftduel(false);
    setIsStatsOpen(false); // Close Stats if KOTH is opened
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setActiveButton(page);
  };

  const toggleOpenA = () => {
    setIsOpenA(!isOpenA);
    setIsOpenNftduel(false);
    setIsOpenKoth(false);
    setIsStatsOpen(false); // Close Stats if A is opened
  };

  const toggleOpenNftduel = () => {
    setIsOpenNftduel(!isOpenNftduel);
    setIsOpenA(false);
    setIsOpenKoth(false);
    setIsStatsOpen(false); // Close Stats if Nftduel is opened
  };
      const toggleDuelHistory = () => {
        setIsDuelHistoryOpen((prev) => !prev);
      };
      const toggleDuelHistorySecond = () => {
        setIsDuelHistorySecondOpen((prev) => !prev);
      };
      const toggleDuelHistoryThird = () => {
        setIsDuelHistoryThirdOpen((prev) => !prev);
      };

  const toggleStats = () => {
    setIsStatsOpen((prev) => !prev);
    // Close other sections if Stats is opened
    if (!isStatsOpen) {
      setIsOpenA(false);
      setIsOpenNftduel(false);
      setIsOpenKoth(false);
      setShowPlayers(false);
    }
  };

return (
  <div>
      <div className={homeStyle.wrapper}>
        <Header 
          onToggleA={toggleOpenA} 
          onToggleNftduel={toggleOpenNftduel} 
          onToggleKoth={toggleOpenKoth}
          toggleStats={toggleStats} 
        />

        {isStatsOpen ? (
          <Stats />
        ) : (
          <>
            {!isOpenA && !isOpenNftduel && !isOpenKoth && (
              <div className={`${homeStyle.welcomeText} ${isGlowing ? homeStyle.glow : ''}`}>
                {displayText}
              </div>
            )}

            <button
              className={homeStyle.chatboxToggleButton}
              onClick={() => setShowInventory(!showInventory)}
            >
              {showInventory ? 'CLOSE INVENTORY' : 'OPEN INVENTORY'}
            </button>
            {showInventory && <Inventory />}

            <div className={`${potCardsContainer.potCardsContainer} ${isOpenA ? potCardsContainer.open : potCardsContainer.closed}`}>
              <button className={homeStyle.players} onClick={() => setShowPlayers(!showPlayers)}>
                {showPlayers ? 'LUCKY69' : 'PLAYERS'}
              </button>
              
              {showPlayers ? (
                <>
                  <PotCardPlayers />
                  <PotCardNFTPlayers />
                </>
              ) : (
                <>
                  <PotCard />
                  <PotCardC />
                </>
              )}
            </div>

            {(showPlayers || isOpenA) && <div className={homeStyle.lineAfter}></div>}

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
                      BERA OUTLAWS
                    </button>
                  </div>
                </div>
                {currentPage === 'duel' ? (
                  <>
                    <Nftduelstatus /> 
                    <div className={homeStyle.nftDuelHistoryContainer}>
                      <div onClick={toggleDuelHistory} className={homeStyle.toggleButton}>
                        {isDuelHistoryOpen ? '↑' : '↓'} DUEL HISTORY
                      </div>
                      <div
                        className={`${homeStyle.dropdownContent} ${isDuelHistoryOpen ? homeStyle.open : homeStyle.closed}`}
                      >
                        <NftDuelhistory />
                      </div>
                    </div>
                    <Nftduel />
                  </>
                ) : currentPage === 'second' ? (
                  <>
                    <Nftduelstatussecond />
                    <div className={homeStyle.nftDuelHistoryContainer}>
                      <div onClick={toggleDuelHistorySecond} className={homeStyle.toggleButton}>
                        {isDuelHistorySecondOpen ? '↑' : '↓'} DUEL HISTORY 
                      </div>
                      <div
                        className={`${homeStyle.dropdownContent} ${isDuelHistorySecondOpen ? homeStyle.open : homeStyle.closed}`}
                      >
                        <NftDuelhistorySecond />
                      </div>
                    </div>
                    <Nftduelsecond />
                  </>
                ) : currentPage === 'third' ? (
                  <>
                    <Nftduelstatusthird />
                    <div className={homeStyle.nftDuelHistoryContainer}>
                      <div onClick={toggleDuelHistoryThird} className={homeStyle.toggleButton}>
                        {isDuelHistoryThirdOpen ? '↑' : '↓'} DUEL HISTORY
                      </div>

                      <div
                        className={`${homeStyle.dropdownContent} ${isDuelHistoryThirdOpen ? homeStyle.open : homeStyle.closed}`}
                      >
                        <NftDuelhistoryThird />
                      </div>
                    </div>
                    <Nftduelthird />
                  </>
                ) : null}
              </div>
            )}
            <div className={`${potCardsContainer.potCardsContainer} ${isOpenKoth ? potCardsContainer.open : potCardsContainer.closed}`}>
              <KOTHLeader/>
              <KOTH /> 
            </div>

            <div className={`${potCardsContainer.potCardsContainer} ${isOpenA ? potCardsContainer.open : potCardsContainer.closed}`}>
              <button className={homeStyle.players} onClick={() => setShowGroupAPlayers(!showGroupAPlayers)}>
                {showGroupAPlayers ? 'BIGIRON ' : ' HISTORY'}
              </button>
              
              {showGroupAPlayers ? (
                <>

                  <PotCardBPlayers />
                  <PotCardAPlayers />
                </>
              ) : (
                <>
                  <PotCardB />
                  <PotCardA />
                </>
              )}
            </div>
          </>
        )}

        <Footer />
      </div>
    </div>
  );

}
