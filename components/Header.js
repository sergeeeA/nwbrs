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
      if (networkId !== targetChainId) {
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

const Header = ({ onToggleA, onToggleNftduel, isOpenA, isOpenNftduel }) => {
  const { address, connectWallet } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsDropdownOpen(false);
      }
    };

    // Check if window is defined before accessing it
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
                <button onClick={onToggleA} className={`${style.toggleButton} ${isOpenA ? style.toggleButtonLongBetsToggled : style.toggleButtonLongBets}`}>
                  {isOpenA ? ' STRIP' : 'STRIP'}
                </button>
                <button onClick={onToggleNftduel} className={`${style.toggleButton} ${isOpenNftduel ? style.toggleButtonLongBetsToggled : style.toggleButtonLongBets}`}>
                  {isOpenNftduel ? ' DUEL' : 'DUEL'}
                </button>
                <button onClick={() => setIsModalOpen(true)} className={style.toggleButton}>
                  BIBPOI
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <button onClick={onToggleA} className={`${style.toggleButton} ${isOpenA ? style.toggleButtonLongBetsToggled : style.toggleButtonLongBets}`}>
              {isOpenA ? ' STRIP' : 'STRIP'}
            </button>
            <button onClick={onToggleNftduel} className={`${style.toggleButton} ${isOpenNftduel ? style.toggleButtonLongBetsToggled : style.toggleButtonLongBets}`}>
              {isOpenNftduel ? ' DUEL' : 'DUEL'}
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
