import React, { useEffect, useState, useRef } from 'react';
import Styles from '../styles/Stats.module.css';
import { useAppContext } from '../context/context';
import Web3 from 'web3';

const CombinedComponent = () => {
  const {
    address,
    leaderboardAddresses,
    leaderboardScores,
    kothLeaderboardAddresses,
    kothLeaderboardScores,
  } = useAppContext();

  const [nftInventory, setNftInventory] = useState([]);
  const [newNftInventory, setNewNftInventory] = useState([]);
  const [thirdNftInventory, setThirdNftInventory] = useState([]); // New state for third NFT inventory



  const [hoveredNftId, setHoveredNftId] = useState(null);
  const [nftTraits, setNftTraits] = useState(null);
  const generalLeaderboardRefs = useRef({});
  const hobearLeaderboardRefs = useRef({});

  const fetchNFTInventory = async () => {
    try {
      const response = await fetch(`https://api.routescan.io/v2/network/testnet/evm/80084/etherscan/api?module=account&action=addresstokennftinventory&address=${address}&contractaddress=0x4Ae3985e45784CB73e1886AC603B5FEed4F08a05&page=1&offset=100&apikey=YourApiKeyToken`);
      const data = await response.json();
      if (data.status === "1") {
        setNftInventory(data.result || []);
      } else {
        setError('Failed to fetch NFT inventory');
      }
    } catch (err) {
      setError('Failed to fetch NFT inventory');
      console.error('Error fetching NFT inventory:', err);
    } finally {
    }
  };

  const fetchNewNFTInventory = async () => {

    try {
      const response = await fetch(`https://api.routescan.io/v2/network/testnet/evm/80084/etherscan/api?module=account&action=addresstokennftinventory&address=${address}&contractaddress=0x46B4b78d1Cd660819C934e5456363A359fde43f4&page=1&offset=100&apikey=YourApiKeyToken`);
      const data = await response.json();
      if (data.status === "1") {
        setNewNftInventory(data.result || []);
      } else {
        setNewError('Failed to fetch new NFT inventory');
      }
    } catch (err) {
      setNewError('Failed to fetch new NFT inventory');
      console.error('Error fetching new NFT inventory:', err);
    } finally {
    }
  };

  const fetchNFTInventoryThird = async () => {

    try {
      const response = await fetch(`https://api.routescan.io/v2/network/testnet/evm/80084/etherscan/api?module=account&action=addresstokennftinventory&address=${address}&contractaddress=0x7424C334EC67DB47768189696813248bf1a16675&page=1&offset=100&apikey=YourApiKeyToken`);
      const data = await response.json();
      if (data.status === "1") {
        setThirdNftInventory(data.result || []);
      } else {
        setThirdError('Failed to fetch third NFT inventory');
      }
    } catch (err) {
      setThirdError('Failed to fetch third NFT inventory');
      console.error('Error fetching third NFT inventory:', err);
    } finally {

    }
  };

  const fetchNftTraits = async (tokenId, isNewNft = false, isThirdNft = false) => {
    let apiUrl = '';
    
    if (isThirdNft) {
      apiUrl = `https://ipfs.io/ipfs/QmYcWNeYX72iMaNAxGPPsDTkN1XrUHbnTjhzxzhzUkXwtE/${tokenId}`; // Correct the URL to use the tokenId
    } else if (isNewNft) {
      apiUrl = `https://beramonium-gemhunters-api-bartio-2wsvsugfrq-wl.a.run.app/api/armory/genesis/metadata/${tokenId}`;
    } else {
      apiUrl = `https://ipfs.io/ipfs/QmVzp3QfDt3v3E1J9Z4ZmXb85gVJFsGGzvKDWMzQSrYpVu/${tokenId}`;
    }
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.attributes) {
        setNftTraits(data.attributes);
      } else {
        console.error("No traits found for this NFT.");
        setNftTraits(null);
      }
    } catch (error) {
      console.error('Error fetching NFT traits:', error);
      setNftTraits(null);
    }
  };

  useEffect(() => {
    if (address) {
      fetchNFTInventory();
      fetchNewNFTInventory();
      fetchNFTInventoryThird();

      const intervalId = setInterval(() => {
        fetchNFTInventory();
        fetchNewNFTInventory();
        fetchNFTInventoryThird();
      }, 10000); // Refresh every 10 seconds

      return () => clearInterval(intervalId); // Clean up the interval on unmount
    }
  }, [address]);

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert(`Copied: ${text}`);
      })
      .catch(err => {
        console.error('Error copying to clipboard:', err);
      });
  };
  const generalLeaderboardData = leaderboardAddresses.map((addr, index) => ({
    address: addr,
    score: leaderboardScores[index],
  })).sort((a, b) => b.score - a.score);

  const connectedWalletScore = generalLeaderboardData.find(entry => entry.address === address)?.score || 0;

  const hobearLeaderboardData = kothLeaderboardAddresses.map((addr, index) => ({
    address: addr,
    score: kothLeaderboardScores[index],
  })).sort((a, b) => b.score - a.score);

  const hobearWalletScore = hobearLeaderboardData.find(entry => entry.address === address)?.score || 0;


  const scrollToAddress = () => {
    const generalRef = generalLeaderboardRefs.current[address.toLowerCase()];
    const hobearRef = hobearLeaderboardRefs.current[address.toLowerCase()];

    if (generalRef) {
      generalRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (hobearRef) {
      hobearRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  return (
    <div className={Styles.statbox}>

      {/* Flex Container for Group A and Group C */}
      <div className={Styles.flexContainer}>
        {/* Group A */}
        <div className={Styles.groupContainer}>
          <h2 className={Styles.title} style={{ textDecoration: 'underline' }}>GENERAL LEADERBOARD</h2>
          <div className={Styles.scrollableContainer}>
            <div className={Styles.leaderboard}>
              <div className={Styles.column}> {generalLeaderboardData.map(({ address: leaderboardAddress, score }, index) => (
                  <div
                    key={leaderboardAddress}
                    ref={el => {
                      if (leaderboardAddress.toLowerCase() === address.toLowerCase()) {
                        generalLeaderboardRefs.current[leaderboardAddress.toLowerCase()] = el;
                      }
                    }}
                    className={Styles.scoreContainer}
                  >
                    <span
                      className={Styles.address}
                      onClick={() => copyToClipboard(leaderboardAddress)}
                    >
                      {formatAddress(leaderboardAddress)}
                      {leaderboardAddress.toLowerCase() === address.toLowerCase() && " (YOU)"}
                    </span>
                    <span className={Styles.score}>{score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={Styles.yourscore}>YOUR SCORE: {connectedWalletScore}</div>
                {/* Button to scroll to connected wallet address */}
      {address && (
        <div onClick={scrollToAddress} className={Styles.btn}>
          FIND ME
        </div>
      )}
        </div>
      </div>

      {/* Group B: MY NFTS */}
      <div className={Styles.flexContainer}>
        <div className={Styles.ProfileContainer}>
          <h2 className={Styles.title}>MY NFTS</h2>

          {/* Displaying NFTs for the first inventory */}
          <div className={Styles.nftGrid}>
            {nftInventory.length > 0 ? (
              nftInventory.map((nft, index) => (
                <div
                  className={Styles.nftItem}
                  key={index}
                  onMouseEnter={() => {
                    setHoveredNftId(nft.TokenId);
                    fetchNftTraits(nft.TokenId); // Fetch from the original API
                  }}
                  onMouseLeave={() => {
                    setHoveredNftId(null);
                    setNftTraits(null);
                  }}
                >
                  <img
                    src={`https://ipfs.io/ipfs/QmbdGEVSdkQtYdK6ahzFxsz3kqoVTKwfYNZ36q6YRiR13V/${nft.TokenId}.png`}
                    alt={`NFT ${nft.TokenId}`}
                    className={Styles.nftImage}
                  />
                  <p className={Styles.nftId}>{nft.TokenId}</p>
                  {hoveredNftId === nft.TokenId && nftTraits && (
                    <div className={Styles.traitsContainer}>
                      {nftTraits.map((trait, index) => (
                        <div key={index}>
                          <strong>{trait.trait_type}:</strong> {trait.value}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className={Styles.title}></p>
            )}
          </div>

          {/* Displaying new NFTs */}
          <div className={Styles.nftGrid}>
            {newNftInventory.length > 0 ? (
              newNftInventory.map((nft, index) => (
                <div
                  className={Styles.nftItemSecond}
                  key={index}
                  onMouseEnter={() => {
                    setHoveredNftId(nft.TokenId);
                    fetchNftTraits(nft.TokenId, true); // Fetch from the new API
                  }}
                  onMouseLeave={() => {
                    setHoveredNftId(null);
                    setNftTraits(null);
                  }}
                >
                  <img
                    src={`https://ipfs.io/ipfs/bafybeidutrluxzzeo3jjjugitblg634zbkgqbr7oo32g7zvwdvd2pbxjla/${nft.TokenId}.png`}
                    alt={`NFT ${nft.TokenId}`}
                    className={Styles.nftImage}
                  />
                  <p className={Styles.nftId}>{nft.TokenId}</p>
                  {hoveredNftId === nft.TokenId && nftTraits && (
                    <div className={Styles.traitsContainer}>
                      {nftTraits
                        .filter(trait => ['Class', 'Gear Score', 'Spec'].includes(trait.trait_type))
                        .map((trait, index) => {
                          let color = 'inherit';
                          // Gear score color logic
                          if (trait.trait_type === 'Gear Score') {
                            const gearScore = parseFloat(trait.value);
                            if (gearScore <= 12.5) {
                              color = '#39FF14';
                            } else if (gearScore <= 25) {
                              color = '#4682B4';
                            } else if (gearScore <= 37.5) {
                              color = '#A45DBA';
                            } else if (gearScore <= 50) {
                              color = '#FFFF00';
                            }
                          }
                          return (
                            <div key={index} style={{ color }}>
                              <strong>{trait.trait_type}:</strong> {trait.value}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className={Styles.title}></p>
            )}
          </div>

 {/* Displaying third NFTs */}
<div className={Styles.nftGrid}>
  {thirdNftInventory.length > 0 ? (
    thirdNftInventory.map((nft, index) => (
      <div
        className={Styles.nftItemThird}
        key={index}
        onMouseEnter={() => {
          setHoveredNftId(nft.TokenId);
          fetchNftTraits(nft.TokenId, false, true); // Fetch third NFT traits
        }}
        onMouseLeave={() => {
          setHoveredNftId(null);
          setNftTraits(null);
        }}
      >
        <img
          src={`https://ipfs.io/ipfs/QmUC913AerVHnAYVSVEyYTCvGNaD7yyRkoFoz5tgxy4G1B/${nft.TokenId}.png`} // Update with actual IPFS hash if needed
          alt={`NFT ${nft.TokenId}`}
          className={Styles.nftImage}
        />
        <p className={Styles.nftId}>{nft.TokenId}</p>
        {hoveredNftId === nft.TokenId && nftTraits && (
          <div className={Styles.traitsContainer}>
            {nftTraits.map((trait, index) => {
              let traitColor = ''; // This will store the color for trait types

              // Apply color only to specific trait types (common, uncommon, rare, legendary)
              switch (trait.trait_type.toLowerCase()) {
                case 'common':
                  traitColor = '#00ff00'; // Green for common
                  break;
                case 'uncommon':
                  traitColor = '#00ffff'; // Light blue for uncommon
                  break;
                case 'rare':
                  traitColor = '#d400ff'; // Purple for rare
                  break;
                case 'legendary':
                  traitColor = '#d9ff00'; // Yellow for legendary
                  break;
                default:
                  traitColor = ''; // No color for other trait types (like Body, Mouth, Eyes, etc.)
                  break;
              }

              // Return the trait with its color if it's one of the special types
              return (
                <div key={index}>
                  <strong style={{ color: traitColor }}>
                    {trait.trait_type}:
                  </strong> 
                  {trait.value}
                </div>
              );
            })}
          </div>
        )}
      </div>
    ))
  ) : (
    <p className={Styles.title}></p>
  )}
</div>

        </div>
      </div>

    </div>
  );
};

export default CombinedComponent;
