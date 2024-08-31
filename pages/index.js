import { useState } from 'react';
import Header from '../components/Header';
import PotCardA from '../components/PotCardA';
import PotCardB from '../components/PotCardB';
import PotCardC from '../components/PotCardC';
import PotCard from '../components/PotCard';
import Footer from '../components/Footer';
import Nftduel from '../components/Nftduel';
import Nftduelwins from '../components/Nftduelwins';

import Nftduelstatus from '../components/Nftduelstatus';
import potCardsContainer from '../styles/potCardsContainer.module.css';
import homeStyle from '../styles/Home.module.css';
import Chatbox from '../components/Chatbox';

export default function Home() {
  const [isOpenA, setIsOpenA] = useState(false);
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  const [isOpenNftduel, setIsOpenNftduel] = useState(false);
  const [isNftduelwinsOpen, setIsNftduelwinsOpen] = useState(false);


  // Toggle function for Long Bets (also closes Quick Bets and Nftduel)
  const toggleOpenA = () => {
    setIsOpenA(!isOpenA);
    setIsOpenNftduel(false); // Ensure Nftduel is closed
  };

  // Toggle function for Nftduel (also closes Long Bets and Quick Bets)
  const toggleOpenNftduel = () => {
    setIsOpenNftduel(!isOpenNftduel);
    setIsOpenA(false); // Ensure Long Bets are closed

  };



  // Toggle function for Chatbox dropdown
  const toggleChatbox = () => {
    setIsChatboxOpen(!isChatboxOpen);
  };
  const toggleNftduelwins = () => {
    setIsNftduelwinsOpen(!isNftduelwinsOpen);
  };
  
  return (
    <div className={homeStyle.wrapper}>
      <Header 
        onToggleA={toggleOpenA} 
        onToggleNftduel={toggleOpenNftduel} // Pass the function
        isOpenA={isOpenA} 
        isOpenNftduel={isOpenNftduel} // Pass the state
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
        {isChatboxOpen ? 'HIDE CHAT' : 'SHOW CHAT'}
      </button>

      {isChatboxOpen && <Chatbox />}

      {isOpenNftduel && (
        <div className={homeStyle.potCardsContainer}>
          <div className={homeStyle.potCardsContainer}>
            <Nftduelstatus /> 
          </div>

          <Nftduel /> 

        </div>
      )}

      <div className={`${potCardsContainer.potCardsContainer} ${isOpenA ? potCardsContainer.open : potCardsContainer.closed}`}>
        <PotCard />
        <PotCardC />
      </div>
      <div className={homeStyle.lineAfter}></div>

      <div className={`${potCardsContainer.potCardsContainer} ${isOpenA ? potCardsContainer.open : potCardsContainer.closed}`}>
        <PotCardB />
        <PotCardA />
      </div>

      <Footer />
    </div>
  );
}
