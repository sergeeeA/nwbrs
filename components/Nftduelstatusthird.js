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

  // Initialize Web3 and the contract
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

  // If no nft or dueler
  const nftClass = nftPrizePoolContractThird === '0x0000000000000000000000000000000000000000'
    ? style.textNotLoaded
    : style.textLoaded;

  const depositorClass = nftFirstDepositorThird === '0x0000000000000000000000000000000000000000'
    ? style.textNotLoaded
    : style.textLoaded;

  // Determine the display text for nftPrizePoolContractThird
  let displayText = 'UNKNOWN NFT'; // Default message
  if (nftPrizePoolContractThird === '0x0000000000000000000000000000000000000000') {
    displayText = 'NO NFT';
  } else if (nftPrizePoolContractThird === NFT_CONTRACT_ADDRESS) {
    displayText = 'BERA OUTLAWS';
  }

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
          setNftImage('/beraoutlaws.jpg'); // Set fallback image if error occurs
        }
      } else {
        setNftImage('/beraoutlaws.jpg'); // Set fallback image if no contract
      }
    };

    fetchTokenId();
  }, [nftPrizePoolContractThird, fetchNftPrizePoolTokenIdThird]);

  return (
    <div className={style.parentcontainer}>

      <div className={style.wrappernft}>
        <div className={style.centeredContainer}>
          <p className={style.rafflefeetitle} style={{ textDecoration: 'underline' }}> BERA OUTLAWS </p>

          {nftPrizePoolContractThird === NFT_CONTRACT_ADDRESS && (
            <div
              onMouseEnter={() => setShowTraits(true)} // Show traits on hover
              onMouseLeave={() => setShowTraits(false)} // Hide traits on leave
            >
              <img
                src={nftImage || '/beraoutlaws.jpg'} // Fallback to /beramonium.png if no valid image
                alt="Special NFT"
                className={`${style.nftImagethird}`}
                ref={imageRef}
                onError={(e) => e.target.src = '/beraoutlaws.jpg'} // Fallback if image fails to load
              />
            </div>
          )}

          <p className={`${style.rafflefeetitle} ${nftClass}`}>
            <span>{displayText}</span>
          </p>

          {nftTokenId !== null && nftPrizePoolContractThird !== '0x0000000000000000000000000000000000000000' && (
            <p className={style.textNotLoaded}>TOKEN ID: {nftTokenId}</p>
          )}

          {/* "More Info" text that triggers hover */}
          <div className={style.moreInfoContainer}>
            <p className={style.rafflefeetitle}>
              <span className={style.rafflefeetitle}>▼ DETAILS</span>
            </p>

            {/* Hidden content that will be shown on hover */}
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

export default NftDuel;

//{showTraits && nftTraits.length > 0 && (
 // <div className={style.traitsContainerThird}>
  //  {nftTraits.map((trait, index) => (
   //   <div key={index} className={getTraitClass(trait)}>
   //     <strong>{trait.trait_type}:</strong> {trait.value}
   //   </div>
// ))}
 // </div>
//)}