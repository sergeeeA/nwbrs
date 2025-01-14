import { useAppContext } from '../context/context';
import style from '../styles/Connect.module.css';
import WalletConnectBtn from './WalletConnectBtn';

const TARGET_CHAIN_ID = '0x138D4'; // Chain ID 80084 in hexadecimal

const WalletConnectMessage = ({ connectWallet: propConnectWallet }) => {
  const { address, connectWallet } = useAppContext();

  // If the address is already available, return null
  if (address) return null;

  const handleConnect = async () => {
    // Check if MetaMask is installed
    if (window.ethereum) {
      try {
        // Request network change
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: TARGET_CHAIN_ID }],
        });
      } catch (switchError) {
        // If MetaMask returns an error (e.g., network not available), handle it here
        if (switchError.code === 4902) {
          // Chain is not added to MetaMask, you can request adding it here if necessary
          console.log('This chain is not added to MetaMask.');
        } else {
          console.error(switchError);
        }
      }
    } else {
      alert('MetaMask is not installed');
    }

    // Proceed with wallet connection after network switch
    await connectWallet();
  };

  return (
    <div className={style.overlay}>
      <button className={style.loginBtn} onClick={handleConnect}>
        CONNECT WALLET
      </button>
      <div className={style.Word}>
        to continue.
      </div>
    </div>
  );
};

export default WalletConnectMessage;
