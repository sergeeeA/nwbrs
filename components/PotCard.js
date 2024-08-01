import React from 'react'
import style from '../styles/PotCard.module.css'
import truncateEthAddress from 'truncate-eth-address'
import { useAppContext } from '../context/context'

const PotCard = () => {
  const { lotteryId, lastWinner, lotteryPot, enterLottery, pickWinner } = useAppContext()

  const handleSwitchNetwork = async () => {
    try {
      const chainId = '0x138D4'; // Chain ID 80084 in hexadecimal

      if (window.ethereum) {
        const provider = window.ethereum;
        const currentChainId = await provider.request({ method: 'eth_chainId' });

        if (currentChainId !== chainId) {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId }],
          });
        }
      } else {
        console.error('MetaMask is not installed');
      }
    } catch (error) {
      console.error('Failed to switch network', error);
    }
  };

  const handleGambooolClick = async () => {
    await handleSwitchNetwork();
    enterLottery();
  };

  return (
    <div className={style.wrapper}>
      <div className={`${style.title}`}>
        Slot
        <span className={style.textAccent}>{lotteryId ? lotteryId : '1'}</span>
      </div>

      <div className={`${style.pot}`}>
        Prize: <span className={style.goldAccent}>{lotteryPot} BERA</span>
      </div>

      <div className={`${style.recentWinnerTitle}`}>
        Lucky Bera
      </div>
      <div className={`${style.lineAfter}`}></div>

      {!lastWinner.length ? (
        <div className={`${style.winner}`}>No winner yet</div>
      ) : (
        lastWinner.length > 0 && (
          <div className={`${style.winner}`}>
            {truncateEthAddress(lastWinner[lastWinner.length - 1])}
          </div>
        )
      )}

      <div className={style.btn} onClick={handleGambooolClick}>
        BUY RAFFLE
      </div>

    </div>
  )
}

export default PotCard
//      <div className={style.btn} onClick={pickWinner}>
// Only Admin
// </div>
// This is for admin access