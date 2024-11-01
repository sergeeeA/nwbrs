import React, { useEffect, useState } from 'react';
import style from '../styles/kothleader.module.css';
import { useAppContext } from '../context/context';

const NftDuel = () => {
  const { address, kothLeaderboardAddresses, kothLeaderboardScores } = useAppContext();
  const [nftQuantity, setNftQuantity] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false); // State for expansion
  const nftAddress = "0x4Ae3985e45784CB73e1886AC603B5FEed4F08a05";
  const walletAddress = "0x0000000000000000000000000000000000000000"; // Zero address

  useEffect(() => {
    const fetchNftData = async () => {
      try {
        const response = await fetch(`https://api.routescan.io/v2/network/testnet/evm/80084/etherscan/api?module=account&action=addresstokennftbalance&address=${walletAddress}&page=1&offset=100&apikey=YourApiKeyToken`);
        const data = await response.json();
        const tokenData = data.result.find(token => token.TokenAddress.toLowerCase() === nftAddress.toLowerCase());
        setNftQuantity(tokenData ? tokenData.TokenQuantity : 0);
      } catch (error) {
        console.error('Error fetching NFT data:', error);
      }
    };

    fetchNftData();
  }, [walletAddress, nftAddress]);

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (address) => {
    navigator.clipboard.writeText(address).then(() => {
      alert(`Copied: ${address}`);
    }).catch(err => {
      console.error('Error copying to clipboard:', err);
    });
  };

  // Combine addresses and scores into an array of objects
  const leaderboardData = kothLeaderboardAddresses.map((addr, index) => ({
    address: addr,
    score: kothLeaderboardScores[index]
  }));

  // Sort the array by score in descending order
  leaderboardData.sort((a, b) => b.score - a.score);

  // Get the score for the connected wallet address
  const connectedWalletScore = leaderboardData.find(entry => entry.address === address)?.score || 0;



  return (
    <div className={style.wrappernft}>

      <div className={`${style.parentcontainer}`}>
        <div className={style.address} style={{ textDecoration: 'underline' }}>OCCUPIED BY</div>
        <div className={style.topAddressContainer}>
          {leaderboardData[0] ? (
            <>
              <span 
                className={style.topAddress} 
                onClick={() => copyToClipboard(leaderboardData[0].address)}
              >
                {formatAddress(leaderboardData[0].address)}
              </span>
              <span className={style.topScore}>{leaderboardData[0].score}</span>
            </>
          ) : (
            <span className={style.topAddress}>NO ONE</span>
          )}
        </div>
  
        <div className={style.container}>
        <h3 className={style.address}  style={{ textDecoration: 'underline' }}>TOTAL NFTs BURNED</h3>
          {nftQuantity !== null && (
            <h3 className={style.inabox} >{nftQuantity}</h3>
            
          )}
          <h3 className={style.address} style={{ textDecoration: 'underline' }}>YOUR DWELLERS BURNED</h3>
          <div className={style.address}>
            <h3  className={style.inabox} >{connectedWalletScore}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftDuel;
