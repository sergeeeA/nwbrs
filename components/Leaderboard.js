import React from 'react';
import Styles from '../styles/leaderboard.module.css';
import { useAppContext } from '../context/context';

const Leaderboard = () => {
  const { address, leaderboardAddresses, leaderboardScores } = useAppContext();

  // Function to format the address
  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Function to copy address to clipboard
  const copyToClipboard = (address) => {
    navigator.clipboard.writeText(address)
      .then(() => {
        alert(`Copied: ${address}`);
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });
  };

  // Combine addresses and scores into an array of objects
  const combinedData = leaderboardAddresses.map((address, index) => ({
    address,
    score: leaderboardScores[index],
  }));

  // Sort the combined data by score in descending order
  const sortedData = combinedData.sort((a, b) => b.score - a.score);

  // Get the score for the connected wallet address
  const connectedWalletScore = sortedData.find(entry => entry.address === address)?.score || 0;

  return (
    <div className={Styles.statbox}>
      <h2 className={Styles.header}>LEADERBOARD</h2>
      
      {/* Display connected wallet's score */}
      <div className={Styles.word}>
        <h3>YOUR SCORE: {connectedWalletScore}</h3>
      </div>

      {sortedData.length === 0 ? (
        <p className={Styles.address}>NOT AVAILABLE</p>
      ) : (
        <div className={Styles.leaderboard}>
          <div className={Styles.column}>
            <strong className={Styles.titlecontent}>ADDRESS</strong>
            {sortedData.map(({ address }) => (
              <div key={address} onClick={() => copyToClipboard(address)} className={Styles.address}>
                {formatAddress(address)}
              </div>
            ))}
          </div>
          <div className={Styles.column}>
            <strong className={Styles.titlecontent}>SCORE</strong>
            {sortedData.map(({ score }, index) => (
              <div key={index} className={Styles.word}>
                {score}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
