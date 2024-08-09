import React, { useEffect, useRef } from 'react';
import style from '../styles/PotCard.module.css';
import { useAppContext } from '../context/context';

const PotCard = () => {
  const { lotteryPot, enterLottery } = useAppContext();
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;

    const handleMouseMove = (e) => {
      const { clientWidth: width, clientHeight: height } = card;
      const { offsetX: x, offsetY: y } = e;

      // Calculate the center position
      const centerX = width / 2;
      const centerY = height / 2;

      // Calculate the distance from the center
      const deltaX = x - centerX;
      const deltaY = y - centerY;

      // Normalize values to the range [-1, 1]
      const normalizedX = deltaX / centerX;
      const normalizedY = deltaY / centerY;

      // Maximum tilt angles
      const maxTiltX = 20; // Maximum tilt angle for X direction
      const maxTiltY = 20; // Maximum tilt angle for Y direction

      // Calculate tilt angles based on normalized values
      const tiltX = normalizedX * maxTiltX;
      const tiltY = -normalizedY * maxTiltY;

      // Apply transform
      card.style.transform = `rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale(1.05)`;
    };

    const handleMouseLeave = () => {
      // Reset transform on mouse leave
      card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    };

    // Add event listeners
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    // Clean up event listeners on component unmount
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

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
    <div className={style.wrapper} ref={cardRef}>
      <div className={`${style.titlebglucky69bg}`}>
        <div className={`${style.title}`}>
          Lucky 69
        </div>
      </div>

      <div className={`${style.pot}`}>
        Prize: <span className={style.goldAccent}>{lotteryPot} BERA</span>
      </div>

      <div className={`${style.rafflefeetitle}`}>
        RAFFLE FEE
      </div>
      <div className={`${style.rafflefeebg}`}>
        <div className={`${style.rafflefee}`}>1 BERA</div>
      </div>

      <div className={`${style.lineAfter}`}></div>

      <div className={style.btn} onClick={handleGambooolClick}>
        BUY RAFFLE
      </div>
    </div>
  );
};

export default PotCard;
/*comment*/