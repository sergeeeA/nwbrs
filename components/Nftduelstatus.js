import React, { useEffect, useRef, useState } from 'react';
import style from '../styles/PotCard.module.css'; // Ensure this file contains the necessary CSS
import { useAppContext } from '../context/context';
import Web3 from 'web3'; // Import Web3

const NFT_CONTRACT_ADDRESS = '0x4Ae3985e45784CB73e1886AC603B5FEed4F08a05';

const NftDuel = () => {
  const {
    nftPrizePoolContract,
    nftFirstDepositor,
    lastNFTPrizeWinner,
    fetchPlayerWins,
    playerWins,
    address,
  } = useAppContext(); // Fetch necessary data and functions from context

  // State for player wins
  const [wins, setWins] = useState(null);

  // Initialize Web3 and the contract
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

  // Determine the display text for nftPrizePoolContract
  let displayText = 'UNKNOWN NFT'; // Default message

  if (nftPrizePoolContract === '0x0000000000000000000000000000000000000000') {
    displayText = 'NO NFT';
  } else if (nftPrizePoolContract === NFT_CONTRACT_ADDRESS) {
    displayText = 'BERA DWELLER NFT';
  } else {
    displayText = nftPrizePoolContract;
  }

  // Determine the CSS classes based on nftPrizePoolContract and nftFirstDepositor
  const nftClass = nftPrizePoolContract === '0x0000000000000000000000000000000000000000'
    ? style.textNotLoaded
    : style.textLoaded;

  const depositorClass = nftFirstDepositor === '0x0000000000000000000000000000000000000000'
    ? style.textNotLoaded
    : style.textLoaded;

  // Format the addresses
  const formatAddress = (address) => {
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      return 'NO PLAYER';
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const challengerText = formatAddress(nftFirstDepositor);
  const winnerText = formatAddress(lastNFTPrizeWinner); // Format the lastNFTPrizeWinner address

  const imageRef = useRef(null);

  useEffect(() => {
    const image = imageRef.current;

    const handleMouseMove = (e) => {
      if (!image) return;
      const { clientWidth: width, clientHeight: height } = image;
      const { offsetX: x, offsetY: y } = e;

      const centerX = width / 2;
      const centerY = height / 2;
      const deltaX = x - centerX;
      const deltaY = y - centerY;
      const normalizedX = deltaX / centerX;
      const normalizedY = deltaY / centerY;
      const maxTiltX = 35;
      const maxTiltY = 35;
      const tiltX = normalizedX * maxTiltX;
      const tiltY = -normalizedY * maxTiltY;

      image.style.transform = `rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale(1.5)`;
    };

    const handleMouseLeave = () => {
      if (!image) return;
      image.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    };

    image.addEventListener('mousemove', handleMouseMove);
    image.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (image) {
        image.removeEventListener('mousemove', handleMouseMove);
        image.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Determine the CSS class for the image based on nftPrizePoolContract
  const imageClass = nftPrizePoolContract === NFT_CONTRACT_ADDRESS
    ? style.visibleImage
    : style.hiddenImage;

  // Function to handle fetch player wins
  const handleFetchPlayerWins = async () => {
    if (address) {
      await fetchPlayerWins(address);
      setWins(playerWins);
    }
  };

  return (
    <div className={style.parentcontainer}>
      <div className={style.wrappernft}>
        <div className={`${style.nftduelbg}`}>
          <h2 className={style.title}>WAGER NFT</h2>
        </div>

        <div className={style.centeredContainer}>
          <p className={style.rafflefeetitle} style={{ textDecoration: 'underline' }}> NFT </p>
          <img
            src="/NFTduel.png"
            alt="NFT"
            className={`${style.nftImage} ${imageClass}`}
            ref={imageRef}
          />
          <p className={`${style.rafflefeetitle} ${nftClass}`}>
            <span>{displayText}</span>
          </p>
          <p className={style.rafflefeetitle} style={{ textDecoration: 'underline' }}> CHALLENGER </p>
          <p className={`${style.rafflefeetitle} ${depositorClass}`}>
            <span>{challengerText}</span>
          </p>
          <p className={style.rafflefeetitlesmol} style={{  textDecoration: 'underline' }}> LAST WINNER </p>
          <p className={style.textNotLoaded}>
            <span>{winnerText}</span> 
          </p>
        
        </div>

          
  
      </div>
    </div>
  );
};

export default NftDuel;
