import React from 'react';
import Styles from '../styles/leaderboard.module.css';
import { useAppContext } from '../context/context';

const Leaderboard = () => {
  const { leaderboardAddresses, leaderboardScores } = useAppContext();

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

  return (
    <div className={Styles.statbox}>
      <h2 className={Styles.header}>LEADERBOARD</h2>
      {leaderboardAddresses.length === 0 ? (
        <p>No data available</p>
      ) : (
        <div className={Styles.leaderboard}>
          <div className={Styles.column}>
            <strong className={Styles.titlecontent}>ADDRESS</strong>
            {leaderboardAddresses.map((address, index) => (
              <div key={address} onClick={() => copyToClipboard(address)} className={Styles.address}>
                {formatAddress(address)}
              </div>
            ))}
          </div>
          <div className={Styles.column}>
            <strong className={Styles.titlecontent}>SCORE</strong>
            {leaderboardScores.map((score, index) => (
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
