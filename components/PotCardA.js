import React, { useEffect, useRef } from 'react';
import style from '../styles/PotCard.module.css';
import { useAppContext } from '../context/context';

const PotCard = () => {
  const { duelnft, miniGameNFTTokenId, miniGameNFTfirstDepositor } = useAppContext();
  const cardRef = useRef(null);

  // Helper function to format Ethereum address
  const formatAddress = (address) => {
    if (!address || address === '0x0000000000000000000000000000000000000000') return 'NO PLAYER';
    if (address.length <= 10) return address; // If the address is already short, return it as is
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

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
    duelnft();
  };

  useEffect(() => {
    const card = cardRef.current;

    const handleMouseMove = (e) => {
      const { clientWidth: width, clientHeight: height } = card;
      const { offsetX: x, offsetY: y } = e;

      const centerX = width / 2;
      const centerY = height / 2;
      const deltaX = x - centerX;
      const deltaY = y - centerY;
      const normalizedX = deltaX / centerX;
      const normalizedY = deltaY / centerY;
      const maxTiltX = 20;
      const maxTiltY = 20;
      const tiltX = normalizedX * maxTiltX;
      const tiltY = -normalizedY * maxTiltY;

      card.style.transform = `rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale(1.05)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const nftText = miniGameNFTTokenId > 0 ? 'BERA DWELLER' : 'NONE';
  const isDepositorLoaded = miniGameNFTfirstDepositor && miniGameNFTfirstDepositor !== '0x0000000000000000000000000000000000000000';
  const depositorStatusClass = isDepositorLoaded ? style.textLoaded : style.textNotLoaded;
  const depositorStatus = formatAddress(miniGameNFTfirstDepositor);

  const handleTitleClick = () => {
    window.location.href = 'https://bera-tec.gitbook.io/bera-tec/testnet-guide/new-beras/big-iron'; // Replace with your target URL
  };

  return (
    <div className={style.wrapper} ref={cardRef}>
      <div className={style.titlebigironnftbg}>
        <div className={style.titleBigiron} onClick={handleTitleClick}>
          BIG IRON NFT
        </div>
      </div>

      <div className={`${style.depositorStatus} ${depositorStatusClass}`}>
        {depositorStatus}
      </div>

      <div className={style.pot}>
        NFT: <span className={nftText === 'NONE' ? style.textNotLoaded : style.goldAccent}>{nftText}</span>
      </div>
      <div className={style.rafflefeebg}>
        <div className={style.rafflefee}>
          Duel Wager: 1
        </div>
      </div>
      <div className={style.lineAfter}></div>

      <div className={style.btnbigiron} onClick={handleGambooolClick}>
        DUEL
      </div>
    </div>
  );
};

export default PotCard;
