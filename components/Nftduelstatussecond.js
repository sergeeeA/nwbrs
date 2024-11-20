import React, { useEffect, useRef, useState } from 'react';
import style from '../styles/nftduel.module.css'; // Ensure this file contains the necessary CSS
import { useAppContext } from '../context/context';
import Web3 from 'web3'; // Import Web3

const BERAMONIUM = '0x46B4b78d1Cd660819C934e5456363A359fde43f4';

const NftDuel = () => {
  const {
    nftPrizePoolContractSecond,
    nftFirstDepositorSecond,
    lastNFTPrizeWinnerSecond,
    fetchNftPrizePoolTokenIdSecond,
  } = useAppContext(); // Fetch necessary data and functions from context

  // State for the NFT token ID, image, attributes, and hover status
  const [nftTokenId, setNftTokenId] = useState(null);
  const [nftImage, setNftImage] = useState(''); // State to hold the NFT image URL
  const [nftAttributes, setNftAttributes] = useState([]); // State to hold NFT attributes
  const [isHovered, setIsHovered] = useState(false); // State for hover status
  const backgroundRef = useRef(null); // Reference for background
  // Initialize Web3 and the contract
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

  // Determine the display text for nftPrizePoolContract
  let displayText = 'UNKNOWN NFT'; // Default message
  if (nftPrizePoolContractSecond === '0x0000000000000000000000000000000000000000') {
    displayText = 'NO NFT';
  } else if (nftPrizePoolContractSecond === BERAMONIUM) {
    displayText = 'BERAMONIUM: BARTIOSIS';
  } else {
    displayText = nftPrizePoolContractSecond;
  }

  // Determine the CSS classes based on nftPrizePoolContract
  const nftClass = nftPrizePoolContractSecond === '0x0000000000000000000000000000000000000000'
    ? style.textNotLoaded
    : style.textLoadedsecond;

  const depositorClass = nftFirstDepositorSecond === '0x0000000000000000000000000000000000000000'
    ? style.textNotLoaded
    : style.textLoadedsecond;

  // Format the addresses
  const formatAddress = (address) => {
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      return 'NO PLAYER';
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const challengerText = formatAddress(nftFirstDepositorSecond);
  const winnerText = formatAddress(lastNFTPrizeWinnerSecond); // Format the lastNFTPrizeWinner address

  const imageRef = useRef(null);
  const specialImageRef = useRef(null); // Separate ref for the special image

  useEffect(() => {
    const fetchTokenId = async () => {
      if (nftPrizePoolContractSecond && nftPrizePoolContractSecond !== '0x0000000000000000000000000000000000000000') {
        try {
          const tokenId = await fetchNftPrizePoolTokenIdSecond(0);
          console.log('Fetched Second Token ID:', tokenId);

          if (tokenId) {
            setNftTokenId(tokenId);
            console.log('Token ID set to:', tokenId);

            const imageUrl = `https://ipfs.io/ipfs/bafybeidutrluxzzeo3jjjugitblg634zbkgqbr7oo32g7zvwdvd2pbxjla/${tokenId}.png`;
            setNftImage(imageUrl);

            // Fetch metadata from the new API
            const response = await fetch(`https://beramonium-gemhunters-api-bartio-2wsvsugfrq-wl.a.run.app/api/armory/genesis/metadata/${tokenId}`);
            const metadata = await response.json();
            setNftAttributes(metadata.attributes || []); // Set attributes from API response
          } else {
            console.warn('Token ID is null.');
          }
        } catch (error) {
          console.error('Error fetching NFT Token ID:', error);
        }
      }
    };

    fetchTokenId();
  }, [nftPrizePoolContractSecond, fetchNftPrizePoolTokenIdSecond]);

  useEffect(() => {
    const image = imageRef.current;
    const specialImage = specialImageRef.current;

    const handleMouseMove = (event) => {
      if (backgroundRef.current) {
        const x = (event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        backgroundRef.current.style.backgroundPosition = `
                                                          ${x * 12}px, 
                                                          ${x * -9}px,
                                                          ${x * 4}px`;
      }
    };

    // 3D effect for images
    const apply3DEffect = (img) => {
      const handleMouseMoveImage = (e) => {
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

      img.addEventListener('mousemove', handleMouseMoveImage);
      img.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        if (img) {
          img.removeEventListener('mousemove', handleMouseMoveImage);
          img.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    };

    // Apply 3D effect to the appropriate image
    if (specialImage && (nftPrizePoolContractSecond === BERAMONIUM)) {
      apply3DEffect(specialImage);
    } else if (image) {
      apply3DEffect(image);
    }

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [nftPrizePoolContractSecond, nftImage]);

  // Determine the CSS class for the images based on nftPrizePoolContract
  const specialImageClass = nftPrizePoolContractSecond === BERAMONIUM
    ? style.visibleImage
    : style.hiddenImage;

  return (
<div className={style.parentcontainer}>
  {isHovered && nftAttributes.length > 0 && (
    <div className={style.traitsContainerSecond}>
      
      {/* Gear Score */}
      {nftAttributes
        .filter(attr => attr.trait_type === 'Gear Score')
        .map((attr, index) => {
          let color;
          const gearScore = parseFloat(attr.value); // Convert value to float

          // Determine color based on gear score value
          if (gearScore <= 12.5) {
            color = '#39FF14'; // Neon green
          } else if (gearScore <= 25) {
            color = '#4682B4'; // Neon blue
          } else if (gearScore <= 37.5) {
            color = '#A45DBA'; // Purple
          } else if (gearScore <= 50) {
            color = '#FFFF00'; // Yellow
          } else {
            color = 'inherit'; // Default color if out of range
          }

          return (
            <div key={index}>
              <strong style={{ color }}>{attr.trait_type.toUpperCase()}:</strong> {attr.value}
            </div>
          );
        })}

      {/* Class and Spec */}
      {['Class', 'Spec'].map(trait => {
        const attr = nftAttributes.find(attr => attr.trait_type === trait);
        return attr ? (
          <div key={trait}>
            <strong>{attr.trait_type.toUpperCase()}:</strong> {attr.value}
          </div>
        ) : null;
      })}

    </div>
  )}
      <div className={style.wrappernftsecond}>
        <div className={`${style.nftduelbgseconds}`} ref={backgroundRef}>
          <h2 className={style.title}></h2>
        </div>

        <div className={style.centeredContainer}>
          <p className={style.rafflefeetitle} style={{ textDecoration: 'underline' }}> BERAMONIUM BARTIOSIS </p>

          {nftPrizePoolContractSecond === BERAMONIUM && nftImage && (
            <div
              onMouseEnter={() => setIsHovered(true)} // Show traits on hover
              onMouseLeave={() => setIsHovered(false)} // Hide traits on mouse leave
            >
              <img
                src={nftImage || "/beramonium.png"} // Use the IPFS link from state
                alt="Special NFT"
                className={`${style.nftImagesecond} ${specialImageClass}`}
                ref={specialImageRef}
              />

            </div>
          )}

          <p className={`${style.rafflefeetitle} ${nftClass}`}>
            <span>{displayText}</span>
          </p>
          {nftTokenId !== null && nftPrizePoolContractSecond !== '0x0000000000000000000000000000000000000000' && (
            <p className={style.textNotLoadedsecond}>TOKEN ID: {nftTokenId}</p>
          )}
          <p className={style.rafflefeetitle} style={{ textDecoration: 'underline' }}> CHALLENGER </p>
          <p className={`${style.rafflefeetitle} ${depositorClass}`}>
            <span>{challengerText}</span>
          </p>

          <p className={style.textNotLoadedsecond}>
            LAST WINNER: <span>{winnerText}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NftDuel;
