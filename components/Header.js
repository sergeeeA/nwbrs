import { useAppContext } from '../context/context'
import style from '../styles/Header.module.css'
import UserCard from './UserCard'
import WalletConnectBtn from './WalletConnectBtn'

// Function to check and switch network
const checkAndSwitchNetwork = async () => {
  const targetChainId = '0x138D4'; // 80084 in hexadecimal

  if (window.ethereum) {
    try {
      // Get current network chain ID
      const networkId = await window.ethereum.request({ method: 'eth_chainId' });

      // Check if the current network is the target network
      if (networkId !== targetChainId) {
        // Request to switch to the target network
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: targetChainId,
            chainName: 'Berachain bArtio',
            rpcUrls: ['https://bartio.rpc.berachain.com/'], // Replace with the appropriate RPC URL
            nativeCurrency: {
              name: 'Berachain-bArtio',
              symbol: 'BERA',
              decimals: 18,
            },
            blockExplorerUrls: ['https://bartio.beratrail.io'], // Replace with the appropriate block explorer URL
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

const Header = () => {
  const { address, connectWallet } = useAppContext();

  // Handle wallet connection and network switching
  const handleConnectWallet = async () => {
    // Connect wallet
    await connectWallet();

    // Check and switch network if necessary
    await checkAndSwitchNetwork();
  };

  return (
    <div className={style.wrapper}>
      <div className={style.title}>NEW BERAS</div>
      {!address ? (
        <WalletConnectBtn connectWallet={handleConnectWallet} />
      ) : (
        <UserCard address={address} />
      )}
    </div>
  );
};

export default Header;
/*comment*/