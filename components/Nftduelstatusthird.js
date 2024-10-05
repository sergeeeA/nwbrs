import React, { useEffect, useRef, useState } from 'react';
import style from '../styles/nftduel.module.css'; // Ensure this file contains the necessary CSS
import { useAppContext } from '../context/context';
import Web3 from 'web3'; // Import Web3

const NFT_CONTRACT_ADDRESS = '0x4Ae3985e45784CB73e1886AC603B5FEed4F08a05';
const SPECIAL_CONTRACT_ADDRESS = '0x46B4b78d1Cd660819C934e5456363A359fde43f4';
const NEW_SPECIAL_CONTRACT_ADDRESS = '0x06d9843595A02f0Dc3bfEdc67dC1C78D2D85b005';

const NftDuel = () => {
  const {
    nftPrizePoolContractThird,
    nftFirstDepositorThird,
    lastNFTPrizeWinnerThird,
    address,
  } = useAppContext(); // Fetch necessary data and functions from context

  // State for player wins
  const [wins, setWins] = useState(null);

  // Initialize Web3 and the contract
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

  // Determine the display text for nftPrizePoolContract
  let displayText = 'UNKNOWN NFT'; // Default message

  if (nftPrizePoolContractThird === '0x0000000000000000000000000000000000000000') {
    displayText = 'NO NFT';
  } else if (nftPrizePoolContractThird === NFT_CONTRACT_ADDRESS) {
    displayText = 'BERA DWELLER NFT';
  } else if (nftPrizePoolContractThird === SPECIAL_CONTRACT_ADDRESS) {
    displayText = 'BERAMONIUM: BARTIOSIS';
  } else if (nftPrizePoolContractThird === NEW_SPECIAL_CONTRACT_ADDRESS) {
    displayText = 'BERA ARENA';
  } else {
    displayText = nftPrizePoolContractThird;
  }

  // Determine the CSS classes based on nftPrizePoolContract and nftFirstDepositor
  const nftClass = nftPrizePoolContractThird === '0x0000000000000000000000000000000000000000'
    ? style.textNotLoadedthird
    : style.textLoadedthird;

  const depositorClass = nftFirstDepositorThird === '0x0000000000000000000000000000000000000000'
    ? style.textNotLoadedthird
    : style.textLoadedthird;

  // Format the addresses
  const formatAddress = (address) => {
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      return 'NO PLAYER';
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const challengerText = formatAddress(nftFirstDepositorThird);
  const winnerText = formatAddress(lastNFTPrizeWinnerThird); // Format the lastNFTPrizeWinner address

  const imageRef = useRef(null);
  const specialImageRef = useRef(null); // Separate ref for the special image
  const backgroundRef = useRef(null); // Ref for the background

  useEffect(() => {
    const image = imageRef.current;
    const specialImage = specialImageRef.current;

    const apply3DEffect = (img) => {
      const handleMouseMove = (e) => {
        if (!img) return;
        const { clientWidth: width, clientHeight: height } = img;
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

        img.style.transform = `rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale(1.5)`;
      };

      const handleMouseLeave = () => {
        if (!img) return;
        img.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      };

      img.addEventListener('mousemove', handleMouseMove);
      img.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        if (img) {
          img.removeEventListener('mousemove', handleMouseMove);
          img.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    };

    if (specialImage && (nftPrizePoolContractThird === SPECIAL_CONTRACT_ADDRESS || nftPrizePoolContractThird === NEW_SPECIAL_CONTRACT_ADDRESS)) {
      apply3DEffect(specialImage);
    } else if (image) {
      apply3DEffect(image);
    }
  }, [nftPrizePoolContractThird]);

  // Handle mouse movement for the parallax effect
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (backgroundRef.current) {
        const x = (event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        backgroundRef.current.style.backgroundPosition = `${x * 0}px, 
                                                          ${x * 12}px, 
                                                          ${x * -9}px`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Determine the CSS class for the images based on nftPrizePoolContract
  const imageClass = nftPrizePoolContractThird === NFT_CONTRACT_ADDRESS
    ? style.visibleImage
    : style.hiddenImage;

  const specialImageClass = nftPrizePoolContractThird === SPECIAL_CONTRACT_ADDRESS || nftPrizePoolContractThird === NEW_SPECIAL_CONTRACT_ADDRESS
    ? style.visibleImage
    : style.hiddenImage;

  return (
    <div className={style.parentcontainer}>
      <div className={style.wrappernftthird}>
        <div className={`${style.nftduelbgthirds}`} ref={backgroundRef}>
          <h2 className={style.title}></h2>
        </div>

        <div className={style.centeredContainer}>
          <p className={style.rafflefeetitle} style={{ textDecoration: 'underline' }}> BEAR ARENA </p>

          {nftPrizePoolContractThird === NEW_SPECIAL_CONTRACT_ADDRESS && (
            <img
              src="/Beraarena.png"
              alt="New Special NFT"
              className={`${style.nftImagethird} ${specialImageClass}`}
              ref={specialImageRef}
            />
          )}
          <p className={`${style.rafflefeetitle} ${nftClass}`}>
            <span>{displayText}</span>
          </p>
          <p className={style.rafflefeetitle} style={{ textDecoration: 'underline' }}> CHALLENGER </p>
          <p className={`${style.rafflefeetitle} ${depositorClass}`}>
            <span>{challengerText}</span>
          </p>
        
          <p className={style.textNotLoaded}>
            LAST WINNER: <span>{winnerText}</span> 
          </p>
        </div>
      </div>
    </div>
  );
};

export default NftDuel;
