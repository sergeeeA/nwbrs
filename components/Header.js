import { useState } from 'react';
import { useAppContext } from '../context/context';
import style from '../styles/Header.module.css';
import UserCard from './UserCard';
import WalletConnectBtn from './WalletConnectBtn';
import Modal from './Modal'; // Import the Modal component

// Function to check and switch network
const checkAndSwitchNetwork = async () => {
  const targetChainId = '0x138D4'; // 80084 in hexadecimal

  if (window.ethereum) {
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

const Header = ({ onToggleA, onToggleB, onToggleNftduel, isOpenA, isOpenB, isOpenNftduel }) => {
  const { address, connectWallet } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

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
        <button
          onClick={onToggleA}
          className={`${style.toggleButton} ${isOpenA ? style.toggleButtonLongBetsToggled : style.toggleButtonLongBets}`}
        >
          {isOpenA ? ' STRIP' : 'STRIP'}
        </button>

        <button
          onClick={onToggleNftduel}
          className={`${style.toggleButton} ${isOpenNftduel ? style.toggleButtonLongBetsToggled : style.toggleButtonLongBets}`}
        >
          {isOpenNftduel ? ' NFT' : 'NFT'}
        </button>

        {/* Button to open the modal */}
        <button onClick={() => setIsModalOpen(true)} className={style.toggleButton}>
           BIBPOI
        </button>
      </div>
      <div>
        {!address ? (
          <WalletConnectBtn connectWallet={handleConnectWallet} />
        ) : (
          <UserCard address={address} />
        )}
      </div>
      
      {/* Modal Component */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Header;
