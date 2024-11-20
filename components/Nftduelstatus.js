import React, { useEffect, useRef, useState } from 'react';
import style from '../styles/nftduel.module.css'; // Ensure this file contains the necessary CSS
import { useAppContext } from '../context/context';
import Web3 from 'web3'; // Import Web3

const NFT_CONTRACT_ADDRESS = '0x4Ae3985e45784CB73e1886AC603B5FEed4F08a05';

const NftDuel = () => {
  const {
    nftPrizePoolContract,
    nftFirstDepositor,
    lastNFTPrizeWinner,
    fetchNftPrizePoolTokenId,
  } = useAppContext(); // Fetch necessary data and functions from context

  // State for player wins and traits
 

  const [nftTokenId, setNftTokenId] = useState(null);
  const [nftImage, setNftImage] = useState(''); // State to hold the NFT image URL
  const [nftTraits, setNftTraits] = useState([]); // Initialize as an empty array
  const [showTraits, setShowTraits] = useState(false); // State to control traits visibility
  const backgroundRef = useRef(null); // Reference for background

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
    const fetchTokenId = async () => {
      if (nftPrizePoolContract && nftPrizePoolContract !== '0x0000000000000000000000000000000000000000') {
        try {
          const tokenId = await fetchNftPrizePoolTokenId(0);
          console.log('Fetched Token ID:', tokenId);
    
          if (tokenId) {
            setNftTokenId(tokenId);
            console.log('Token ID set to:', tokenId);
    
            const imageUrl = `https://ipfs.io/ipfs/QmbdGEVSdkQtYdK6ahzFxsz3kqoVTKwfYNZ36q6YRiR13V/${tokenId}.png`;
            setNftImage(imageUrl);

            // Fetch NFT traits
            const response = await fetch(`https://ipfs.io/ipfs/QmVzp3QfDt3v3E1J9Z4ZmXb85gVJFsGGzvKDWMzQSrYpVu/${tokenId}`);
            const traitsData = await response.json();

            // Set NFT traits from the API response
            setNftTraits(traitsData.attributes || []); // Ensure it's an array
          } else {
            console.warn('Token ID is null, skibidi or die.');
          }
        } catch (error) {
          console.error('Error fetching NFT Token ID:', error);
        }
      }
    };
    
    fetchTokenId();
  }, [nftPrizePoolContract]);

  useEffect(() => {
    const image = imageRef.current;
    const handleMouseMove = (event) => {
      if (backgroundRef.current) {
        const x = (event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        backgroundRef.current.style.backgroundPosition = `${x * 0}px, 
                                                          ${x * 12}px, 
                                                          ${x * -9}px,
                                                          ${x * 4}px`;
      }
    };

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

    if (image) {
      apply3DEffect(image);
    }
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [nftPrizePoolContract, nftImage]);

  // Determine the CSS class for the images based on nftPrizePoolContract
  const imageClass = nftPrizePoolContract === NFT_CONTRACT_ADDRESS
    ? style.visibleImage
    : style.hiddenImage;

  return (
    <div className={style.parentcontainer}>
                    {showTraits && nftTraits.length > 0 && (
                <div className={style.traitsContainer}>
               
                {nftTraits.map((trait, index) => (
                  <div key={index}>
                    <strong>{trait.trait_type}:</strong> {trait.value}
                  </div>
                ))}
              </div>
              )}
      <div className={style.wrappernft}>
        <div className={`${style.nftduelbg}`} ref={backgroundRef}>
          <h2 className={style.title}></h2>
        </div>

        <div className={style.centeredContainer}>
          <p className={style.rafflefeetitle} style={{ textDecoration: 'underline' }}> BERA DWELLERS </p>
          
          {nftPrizePoolContract === NFT_CONTRACT_ADDRESS && nftImage && (
            <div style={{ position: 'relative' }}>
              <img
                src={nftImage || "/NFTduel.png"} // Use fetched NFT image or default
                alt="NFT"
                className={`${style.nftImage} ${imageClass}`}
                ref={imageRef}
                onMouseEnter={() => setShowTraits(true)} // Show traits on hover
                onMouseLeave={() => setShowTraits(false)} // Hide traits on leave
              />

            </div>
          )}

          <p className={`${style.rafflefeetitle} ${nftClass}`}>
            <span>{displayText}</span>
          </p>
          {nftTokenId !== null && nftPrizePoolContract !== '0x0000000000000000000000000000000000000000' && (
            <p className={style.textNotLoaded}>TOKEN ID: {nftTokenId}</p>
          )}
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
