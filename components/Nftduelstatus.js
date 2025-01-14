import React, { useEffect, useRef, useState } from 'react';
import style from '../styles/nftduel.module.css'; 
import { useAppContext } from '../context/context';
import Web3 from 'web3'; 

const NFT_CONTRACT_ADDRESS = '0x4Ae3985e45784CB73e1886AC603B5FEed4F08a05';

const NftDuelstatus = () => {
  const {
    nftPrizePoolContract,
    nftFirstDepositor,
    lastNFTPrizeWinner,
    fetchNftPrizePoolTokenId,
  } = useAppContext(); 

  const [nftTokenId, setNftTokenId] = useState(null);
  const [nftImage, setNftImage] = useState(''); // The NFT image URL
  const [nftTraits, setNftTraits] = useState([]); // Empty array
  const [showTraits, setShowTraits] = useState(false); // Traits visibility
  const [isHovered, setIsHovered] = useState(false); // Hover state for cursor glow visibility
  const cursorRef = useRef(null); // Reference to the cursor glow element

  let displayText = 'UNKNOWN NFT'; 

  if (nftPrizePoolContract === '0x0000000000000000000000000000000000000000') {
    displayText = 'NO NFT';
  } else if (nftPrizePoolContract === NFT_CONTRACT_ADDRESS) {
    displayText = 'BERA DWELLER NFT';
  } 

  const nftClass = nftPrizePoolContract === '0x0000000000000000000000000000000000000000'
    ? style.textNotLoaded
    : style.textLoaded;

  const depositorClass = nftFirstDepositor === '0x0000000000000000000000000000000000000000'
    ? style.textNotLoaded
    : style.textLoaded;

  const formatAddress = (address) => {
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      return 'NO PLAYER';
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const challengerText = formatAddress(nftFirstDepositor);
  const winnerText = formatAddress(lastNFTPrizeWinner); 

  const imageRef = useRef(null);

  useEffect(() => {
    const fetchTokenId = async () => {
      if (nftPrizePoolContract && nftPrizePoolContract !== '0x0000000000000000000000000000000000000000') {
        try {
          const tokenId = await fetchNftPrizePoolTokenId(0);
      
          if (tokenId) {
            setNftTokenId(tokenId);
    
            // Use CORS Anywhere proxy to fetch IPFS data
            const imageUrl = `https://ipfs.infura.io/ipfs/QmbdGEVSdkQtYdK6ahzFxsz3kqoVTKwfYNZ36q6YRiR13V/${tokenId}.png`;


            setNftImage(imageUrl);
          } else {
            console.warn('Token ID is null, skibidi or die.');
          }
        } catch (error) {
          console.error('Error fetching NFT Token ID:', error);
          setNftImage('/beradwellers.jpg'); // Set fallback image if error occurs
        }
      } else {
        setNftImage('/beradwellers.jpg'); // Set fallback image if no contract
      }
    };
    
    fetchTokenId();
    



    // Cleanup on unmount
    return () => {

    };
  }, [nftPrizePoolContract]);

  return (
    <div className={style.parentcontainer}>


      {/* Glowing cursor element */}
      <div
        ref={cursorRef}
        className={`${style.cursorGlow} ${isHovered ? style.cursorGlowVisible : ''}`}
      />

      <div className={style.wrappernft}>
        <div className={style.centeredContainer}>
          <p className={style.rafflefeetitle} style={{ textDecoration: 'underline' }}> BERA DWELLERS </p>

          {nftPrizePoolContract === NFT_CONTRACT_ADDRESS && (
            <div
              onMouseEnter={() => { setIsHovered(true); setShowTraits(true); }}
              onMouseLeave={() => { setIsHovered(false); setShowTraits(false); }} 
            >
              <img
                src={nftImage || '/beradwellers.jpg'} // Fallback to /beramonium.png if no valid image
                alt="NFT"
                className={`${style.nftImage}`}
                ref={imageRef}
                onError={(e) => e.target.src = '/beradwellers.jpg'} // Fallback if image fails to load
              />
            </div>
          )}

          <p className={`${style.rafflefeetitle} ${nftClass}`}>
            <span>{displayText}</span>
          </p>
          {nftTokenId !== null && nftPrizePoolContract !== '0x0000000000000000000000000000000000000000' && (
            <p className={style.textNotLoaded}>TOKEN ID: {nftTokenId}</p>
          )}

          <div className={style.moreInfoContainer}>
            <p className={style.rafflefeetitle}>
              <span className={style.rafflefeetitle}>▼ DETAILS</span>
            </p>

            <div className={style.infoContent}>
              <p className={style.textNotLoaded}>
                CHALLENGER: <span>{challengerText}</span>
              </p>

              <p className={style.textNotLoaded}>
                LAST WINNER: <span>{winnerText}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftDuelstatus;
//{showTraits && nftTraits.length > 0 && (
 // <div className={style.traitsContainer}>
   // {nftTraits.map((trait, index) => (
    //  <div key={index}>
      //  <strong>{trait.trait_type}:</strong> {trait.value}
    //  </div>
  //  ))}
 // </div>
// )}