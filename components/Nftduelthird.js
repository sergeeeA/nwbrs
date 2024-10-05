import React, { useState, useEffect } from 'react';
import style from '../styles/nftduel.module.css';
import { useAppContext } from '../context/context';
import { useNftContext } from '../context/NftContext'; // Import the context
import nftAbi from '../utils/nft'; // Import ABI
import Web3 from 'web3'; // Import Web3

const NFT_CONTRACT_ADDRESS = '0x06d9843595A02f0Dc3bfEdc67dC1C78D2D85b005'; // Fixed contract address
const APPROVE_ADDRESS = '0xD40CB0bc61228053299524031217747780DB88Cd'; // LOTTERY CONTRACT Address to approve

const NftDuel = () => {
  const { depositNFTToPrizePoolThird, withdrawNFTFromPrizePoolThird } = useAppContext();
  const { nftTokenId, setNftTokenId } = useNftContext(); // Use the context
  const [nftContract, setNftContract] = useState(null);

  // Initialize Web3 and the contract
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

  useEffect(() => {
    setNftContract(new web3.eth.Contract(nftAbi.nftAbi, NFT_CONTRACT_ADDRESS));
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (nftTokenId && nftContract) {
      try {
        const accounts = await web3.eth.getAccounts(); // Get the current user's account

        if (accounts.length === 0) {
          alert('Please connect your wallet.');
          return;
        }

        console.log('Approving NFT...');

        // Call the approve function
        const approveResult = await nftContract.methods.approve(APPROVE_ADDRESS, nftTokenId).send({ from: accounts[0] });
        console.log('Approval result:', approveResult);

        console.log('Approval successful. Depositing NFT...');

        // Deposit the NFT to the prize pool
        await depositNFTToPrizePoolThird(NFT_CONTRACT_ADDRESS, nftTokenId, web3.utils.toWei('1', 'ether'));
        console.log('Deposit successful.');

      } catch (error) {
        console.error('Error processing transaction:', error);
        alert('An error occurred: ' + error.message);
      }
    } else {
      alert('Please provide an NFT Token ID.');
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      const index = 0; // Always use index 0 for withdrawal
      await withdrawNFTFromPrizePoolThird(index);
      console.log('Withdrawal successful.');
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      alert('An error occurred: ' + error.message);
    }
  };

  return (
    <div className={style.parentcontainer}>
      <div className={style.wrappernft}>

        <h2 className={style.title} style={{ textDecoration: 'underline' }}>WAGER NFT</h2>



        <label className={style.rafflefeetitle} htmlFor="nftTokenId" style={{ cursor: 'url("/curs.png"), auto',}}>
          TOKEN ID:
        </label>
        <form onSubmit={handleDeposit}>
          <div className={style.tooltip}>
            <input
              type="number"
              id="nftTokenId"
              value={nftTokenId}
              onChange={(e) => setNftTokenId(e.target.value)}
              required
              className={style.numberInput} // Apply the CSS module class here
            />
            <div className={style.tooltiptext}>
            Click any token ID in your NFT Inventory!
            </div>
          </div>
          <div className={style.parentcontainer}>
            <button
              type="submit"
              style={{
                width: '50%', // Makes the button wider than its container
                height: '40%', // Makes the button taller than its container
                padding: '10px 10px',
                backgroundColor: 'transparent',
                color: '#C8AC53',
                fontSize: '20px',
                fontFamily: 'Monofonto',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'center',
                boxSizing: 'border-box',
                transformOrigin: 'center', // Optional: ensures the scaling is from the center
                cursor: 'url("/curs.png"), auto',
              }}
            >
              <div className={style.btn}>
                DEPOSIT NFT
              </div>
            </button>
          </div>
        </form>

        <form onSubmit={handleWithdraw}>
          <div className={style.parentcontainer}>
            <button
              type="submit"
              style={{
                width: '60%', // Makes the button wider than its container
                height: '40%', // Makes the button taller than its container
                padding: '10px 10px',
                backgroundColor: 'transparent',
                color: '#C8AC53',
                fontSize: '20px',
                fontFamily: 'Monofonto',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'center',
                boxSizing: 'border-box',
                transformOrigin: 'center', // Optional: ensures the scaling is from the center
                cursor: 'url("/curs.png"), auto',
              }}
            >
              <div className={style.btn}>
                WITHDRAW NFT
              </div>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default NftDuel;
