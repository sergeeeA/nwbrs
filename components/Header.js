import { useState, useEffect } from 'react';
import { useAppContext } from '../context/context';
import style from '../styles/Header.module.css';
import UserCard from './UserCard';
import WalletConnectBtn from './WalletConnectBtn';
import Modal from './Modal';

const checkAndSwitchNetwork = async () => {
  const targetChainId = '0x138D4';

  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      const networkId = await window.ethereum.request({ method: 'eth_chainId' });
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });

      if (networkId !== targetChainId && accounts.length > 0) {
        // Only attempt to add the network if there is a connected wallet
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: targetChainId,
            chainName: 'Berachain bArtio',
            rpcUrls: ['https://bartio.rpc.berachain.com/'],
            nativeCurrency: {
              name: 'Berachain-bArtio',
              symbol: 'BERA',
              decimals: 18,
            },
            blockExplorerUrls: ['https://bartio.beratrail.io'],
          }],
        });
      }
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  } else {
    console.log('MetaMask is not installed.');
  }
};



const Header = ({ onToggleA, onToggleNftduel, isOpenA, isOpenNftduel, onToggleKoth, isOpenKoth, isStatsOpen, toggleStats }) => {
  const { address, connectWallet, 
    fetchLotteryData, lotteryPot, 
    lastWinner, nftTokenId, 
    lastNFTLotteryWinner, miniGamePool, 
    lastMiniGameWinner, miniGameNFTTokenId,
    miniGameNFTfirstDepositor, lastMiniGameNFTWinner ,
    refreshData,
  } = useAppContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFetchingStrip, setIsFetchingStrip] = useState(false); // State for fetchStripData
  const [isRefreshing, setIsRefreshing] = useState(false); // State for refreshData

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsDropdownOpen(false);
      }
    };

    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth <= 768);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const handleToggleNftDuel = async () => {
    onToggleNftduel(); // Call the original toggle function
    if (isRefreshing) return; // Prevent refresh if already in progress

    setIsRefreshing(true); // Set refreshing state to true
    await refreshData(); // Fetch data after toggling
    setIsRefreshing(false); // Reset refreshing state after completion
  };

  const handleConnectWallet = async () => {
    await connectWallet();
    await checkAndSwitchNetwork();
  };

  const fetchStripData = async () => {
    if (isFetchingStrip) return; // Prevent fetching if already in progress

    setIsFetchingStrip(true); // Indicate that fetching has started

    await fetchLotteryData(); // Fetch latest lottery data for Group A
    console.log('Group A Data:');
    console.log(`lotteryPot: ${lotteryPot}`);
    console.log(`nftTokenId: ${nftTokenId}`);
    console.log(`miniGamePool: ${miniGamePool}`);

    // Delay before fetching Group B data
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Group B Data:');
    console.log(`lastWinner: ${lastWinner}`);
    console.log(`lastNFTLotteryWinner: ${lastNFTLotteryWinner}`);
    console.log(`miniGameNFTTokenId: ${miniGameNFTTokenId}`);

    // Delay before fetching Group C data
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Group C Data:');
    console.log(`firstDepositor: ${miniGameNFTfirstDepositor}`);
    console.log(`lastMiniGameWinner: ${lastMiniGameWinner}`);

    // Delay before fetching Group D data
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Group D Data:');
    console.log(`miniGameNFTfirstDepositor: ${miniGameNFTfirstDepositor}`);
    console.log(`lastMiniGameNFTWinner: ${lastMiniGameNFTWinner}`);
    
    setIsFetchingStrip(false); // Indicate that fetching has completed
  };

  const handleToggleA = async () => {
    onToggleA(); // Call the original toggle function
    await fetchStripData(); // Fetch data after toggling
  };

  return (
    <div className={style.wrapper}>
      <div className={style.title}>
        NEW BERAS
        <span className={style.beta}><sup>BETA</sup></span>
      </div>
      <div className={style.toggleButtons}>
        {isMobile ? (
          <>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={style.toggleButton}>
              MENU
            </button>
            {isDropdownOpen && (
              <div className={style.dropdownMenu}>
                <button onClick={handleToggleA} className={`${style.toggleButton} ${isOpenA ? style.toggleButtonLongBetsToggled : style.toggleButtonLongBets}`}>
                  {isOpenA ? ' STRIP' : 'STRIP'}
                </button>
                <button onClick={handleToggleNftDuel} className={`${style.toggleButton} ${isOpenNftduel ? style.toggleButtonLongBetsToggled : style.toggleButtonLongBets}`}>
                  {isOpenNftduel ? ' DUEL' : 'DUEL'}
                </button>
                <button onClick={onToggleKoth} className={`${style.toggleButton} ${isOpenKoth ? style.toggleButtonLongBetsToggled : style.toggleButtonLongBets}`}>
                  {isOpenKoth ? '  HOBEAR DAM' : ' HOBEAR DAM'}
                </button>
                <button onClick={toggleStats} className={style.toggleButton}>
                  {isStatsOpen ? ' STATS' : ' STATS'}
                </button>
                <button onClick={() => setIsModalOpen(true)} className={style.toggleButton}>
                  BIBPOI
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <button onClick={handleToggleA} className={`${style.toggleButton} ${isOpenA ? style.toggleButtonLongBetsToggled : style.toggleButtonLongBets}`}>
              {isOpenA ? ' STRIP' : 'STRIP'}
            </button>
            <button onClick={handleToggleNftDuel} className={`${style.toggleButton} ${isOpenNftduel ? style.toggleButtonLongBetsToggled : style.toggleButtonLongBets}`}>
              {isOpenNftduel ? ' DUEL' : 'DUEL'}
            </button>
            <button onClick={onToggleKoth} className={`${style.toggleButton} ${isOpenKoth ? style.toggleButtonLongBetsToggled : style.toggleButtonLongBets}`}>
              {isOpenKoth ? '  HOBEAR DAM' : ' HOBEAR DAM'}
            </button>
            <button onClick={toggleStats} className={style.toggleButton}>
              {isStatsOpen ? ' STATS' : ' STATS'}
            </button>
            <button onClick={() => setIsModalOpen(true)} className={style.toggleButton}>
              BIBPOI
            </button>
          </>
        )}
      </div>
      <div>
      {!address ? (
          <WalletConnectBtn connectWallet={handleConnectWallet} />
        ) : (
          <UserCard address={address} />
        )}
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Header;
