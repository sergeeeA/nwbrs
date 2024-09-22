import { useAppContext } from '../context/context'
import style from '../styles/Footer.module.css'
import UserCard from './UserCard'
import WalletConnectBtn from './WalletConnectBtn'


const Header = () => {


  return (
    <div className={style.wrapper}>
      

      <a className={style.Linkdc} href="https://discord.gg/WNCK6z3CFA" target="_blank" rel="noopener noreferrer">
        DISCORD
      </a>


    </div>
  );
};

export default Header;
/*comment*/