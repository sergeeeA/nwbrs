import { useAppContext } from '../context/context';
import style from '../styles/Connect.module.css';
import WalletConnectBtn from './WalletConnectBtn';

const WalletConnectMessage = ({ connectWallet: propConnectWallet }) => {
  const { address, connectWallet } = useAppContext(); 

  // If the address is already available, return null
  if (address) return null;

  return (
    <div className={style.overlay}>


      <button className={style.loginBtn} onClick={connectWallet}>
        CONNECT WALLET
      </button>
      <div className={style.Word}>
        to continue.
      </div>

    </div>
  );
};

export default WalletConnectMessage;
