import { useState, useEffect } from 'react';
import { useAppContext } from '../context/context';
import style from '../styles/Header.module.css';
import UserCard from './UserCard';
import WalletConnectBtn from './WalletConnectBtn';


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



const Header = ({ toggleLottery, toggleBTE,onToggleA,  isOpenA,  isStatsOpen, toggleStats }) => {
  const { address, connectWallet, 

  } = useAppContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
 // State for fetchStripData


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



  const handleConnectWallet = async () => {
    await connectWallet();
    await checkAndSwitchNetwork();
  };


  const handleToggleA = async () => {
    onToggleA(); // Call the original toggle function
   
  };

  return (
    <div className={style.wrapper}>
      <div className={style.navbar}>
      <div className={style.logoWrapper}>
          <img src="logo.png" alt="logo" className={style.logo} />
          <p className={style.logoText}>BERA SHOWDOWN</p> {/* This is the text underneath */}
        </div>
      
        {isMobile ? (
          <>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={style.toggleButton}>
            ≡
            </button>
            {isDropdownOpen && (
              <div className={style.dropdownMenu}>
           <button onClick={handleToggleA} className={`${style.toggleButton} ${isOpenA ? style.toggleButtonLongBetsToggled : style.toggleButtonLongBets}`}>
           DUEL
            </button>
    
                

        
                <button onClick={toggleLottery} className={style.toggleButton}>
                LOTTERY
            </button>
                <button onClick={toggleBTE} className={style.toggleButton}>
                BEARN
            </button>


              </div>
            )}
          </>
        ) : (
          <>
            <button onClick={handleToggleA} className={`${style.toggleButton} ${isOpenA ? style.toggleButtonLongBetsToggled : style.toggleButtonLongBets}`}>
              DUEL
            </button>

 
            

            <button onClick={toggleLottery} className={style.toggleButton}>
                LOTTERY
            </button>
            <button onClick={toggleBTE} className={style.toggleButton}>
            BEARN
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
      

    </div>
  );
};

export default Header;
//           <button onClick={onToggleKoth} className={`${style.toggleButton} ${isOpenKoth ? style.toggleButtonLongBetsToggled : style.toggleButtonLongBets}`}>
// {isOpenKoth ? '  HOBEAR DAM' : ' HOBEAR DAM'}
// </button>


//<button onClick={toggleStats} className={style.toggleButton}>
//STATS
//</button>