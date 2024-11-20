import React, { useEffect, useRef, useState } from 'react';
import style from '../styles/nftduel.module.css'; // Ensure this file contains the necessary CSS
import { useAppContext } from '../context/context';
import Web3 from 'web3'; // Import Web3

const NFT_CONTRACT_ADDRESS = '0x7424C334EC67DB47768189696813248bf1a16675';

const NftDuel = () => {
  const {
    nftPrizePoolContractThird,
    nftFirstDepositorThird,
    lastNFTPrizeWinnerThird,
    fetchNftPrizePoolTokenIdThird,
    address,
  } = useAppContext(); // Fetch necessary data and functions from context

  // State for the NFT token ID, image, attributes, and hover status
  const [nftTokenId, setNftTokenId] = useState(null);
  const [nftImage, setNftImage] = useState(''); // State to hold the NFT image URL
  const [showTraits, setShowTraits] = useState(false); 
  const [nftTraits, setNftTraits] = useState([]); // Initialize as an empty array
  const [isHovered, setIsHovered] = useState(false); // State for hover status
  const backgroundRef = useRef(null); // Reference for background
  const imageRef = useRef(null); // Ref for the image
  const specialImageRef = useRef(null); // Separate ref for the special image

  // Initialize Web3 and the contract
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

  // Determine the display text for nftPrizePoolContractThird
  let displayText = 'UNKNOWN NFT'; // Default message
  if (nftPrizePoolContractThird === '0x0000000000000000000000000000000000000000') {
    displayText = 'NO NFT';
  } else if (nftPrizePoolContractThird === NFT_CONTRACT_ADDRESS) {
    displayText = 'BERA OUTLAWS';
  }

  // Determine the CSS classes based on nftPrizePoolContractThird
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

  // Determine color based on trait name (common, uncommon, rare, legendary)
  const getTraitClass = (trait) => {
    switch (trait.value.toLowerCase()) {
      case 'common':
        return style.common;
      case 'uncommon':
        return style.uncommon;
      case 'rare':
        return style.rare;
      case 'legendary':
        return style.legendary;
      default:
        return ''; // Fallback to no class
    }
  };

  // Fetch and set the NFT token ID
  useEffect(() => {
    const fetchTokenId = async () => {
      if (nftPrizePoolContractThird && nftPrizePoolContractThird !== '0x0000000000000000000000000000000000000000') {
        try {
          const tokenId = await fetchNftPrizePoolTokenIdThird(0);
          if (tokenId) {
            setNftTokenId(tokenId);
            const imageUrl = `https://ipfs.io/ipfs/QmUC913AerVHnAYVSVEyYTCvGNaD7yyRkoFoz5tgxy4G1B/${tokenId}.png`;
            setNftImage(imageUrl);

            // Fetch metadata from the new API
            const response = await fetch(`https://ipfs.io/ipfs/QmYcWNeYX72iMaNAxGPPsDTkN1XrUHbnTjhzxzhzUkXwtE/${tokenId}`);
            const traitsData = await response.json();
            setNftTraits(traitsData.attributes || []); // Ensure it's an array
          }
        } catch (error) {
          console.error('Error fetching NFT Token ID:', error);
        }
      }
    };

    fetchTokenId();
  }, [nftPrizePoolContractThird, fetchNftPrizePoolTokenIdThird]);

  // Apply 3D effect for images
  const apply3DEffect = (img) => {
    const handleMouseMove = (e) => {
      if (!img) return;

      const { left, top, width, height } = img.getBoundingClientRect(); // Get image bounds
      const x = e.clientX - left; // Mouse position relative to the image
      const y = e.clientY - top;

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

  // Handle mouse movement for the parallax effect
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (backgroundRef.current) {
        const x = (event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        backgroundRef.current.style.backgroundPosition = `${x * 24}px, 
                                                          ${x * 48}px, 
                                                          ${x * -9}px`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className={style.parentcontainer}>
      {showTraits && nftTraits.length > 0 && (
        <div className={style.traitsContainerThird}>
          {nftTraits.map((trait, index) => (
            <div key={index} className={getTraitClass(trait)}>
              <strong>{trait.trait_type}:</strong> {trait.value}
            </div>
          ))}
        </div>
      )}

      <div className={style.wrappernftthird}>
        <div className={`${style.nftduelbgthirds}`} ref={backgroundRef}>
          <h2 className={style.title}></h2>
        </div>

        <div className={style.centeredContainer}>
          <p className={style.rafflefeetitle} style={{ textDecoration: 'underline' }}> BERA OUTLAWS </p>

          {nftPrizePoolContractThird === NFT_CONTRACT_ADDRESS && nftImage && (
            <div
              onMouseEnter={() => setIsHovered(true)} // Show traits on hover
              onMouseLeave={() => setIsHovered(false)} // Hide traits on mouse leave
            >
              <img
                src={nftImage || "/default-image.png"} // Use the IPFS link from state or fallback image
                alt="Special NFT"
                className={`${style.nftImagethird}`}
                ref={imageRef}
                onMouseEnter={() => setShowTraits(true)} // Show traits on hover
                onMouseLeave={() => setShowTraits(false)} // Hide traits on leave
                onLoad={() => {
                  // Apply 3D effect after the image loads
                  const image = imageRef.current;
                  if (image && nftPrizePoolContractThird === NFT_CONTRACT_ADDRESS) {
                    apply3DEffect(image);
                  }
                }}
              />
            </div>
          )}

          <p className={`${style.rafflefeetitle} ${nftClass}`}>
            <span>{displayText}</span>
          </p>

          {nftTokenId !== null && nftPrizePoolContractThird !== '0x0000000000000000000000000000000000000000' && (
            <p className={style.textNotLoadedthird}>TOKEN ID: {nftTokenId}</p>
          )}

          <p className={style.rafflefeetitle} style={{ textDecoration: 'underline' }}> CHALLENGER </p>
          <p className={`${style.rafflefeetitle} ${depositorClass}`}>
            <span>{challengerText}</span>
          </p>

          <p className={style.textNotLoadedthird}>
            LAST WINNER: <span>{winnerText}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NftDuel;
