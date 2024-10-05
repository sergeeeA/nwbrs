import React from 'react';
import style from '../styles/kothleader.module.css';
import { useAppContext } from '../context/context';

const NftDuel = () => {
  const { address, kothLeaderboardAddresses, kothLeaderboardScores } = useAppContext();

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
    <><div className={style.address}>OCCUPIED BY</div>
    <div className={style.topAddressContainer}>
      {leaderboardData[0] && (
        <>
          <span className={style.topAddress} onClick={() => copyToClipboard(leaderboardData[0].address)}>
            {formatAddress(leaderboardData[0].address)}
          </span>
          <span className={style.topScore}>{leaderboardData[0].score}</span>
        </>
      )}
    </div>

    <div className={style.parentcontainer}>
      <div className={style.container}>
        <h2 className={style.title} style={{ textDecoration: 'underline' }}>LEADERBOARD</h2>

        <div className={style.address}>
          <h3>DWELLERS SENT: {connectedWalletScore}</h3>
        </div>

        <div className={style.scrollableContainer}>
          {leaderboardData.map((entry, index) => (
            index === 0 ? null : (  // Skip the first entry since it's already displayed above
              <div className={style.scoreContainer} key={entry.address}>
                <span className={style.address} onClick={() => copyToClipboard(entry.address)}>
                  {formatAddress(entry.address)}
                </span>
                <span className={style.score}>{entry.score}</span>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  </>
);
};

export default NftDuel;
