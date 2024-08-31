import React, { useState } from 'react';
import style from '../styles/PotCard.module.css';
import { useAppContext } from '../context/context';
import nftAbi from '../utils/nft'; // Import ABI
import Web3 from 'web3'; // Import Web3

const NFT_CONTRACT_ADDRESS = '0x4Ae3985e45784CB73e1886AC603B5FEed4F08a05'; // NFT CONTRACT
const APPROVE_ADDRESS = '0xBf0f0450Dcbf6b6A983EB27fDffAE79BDdcB5079'; // LOTTERY CONTRACT Address to approve

const NftDuel = () => {
  const { depositNFTToPrizePool, withdrawNFTFromPrizePool } = useAppContext();
  const [nftTokenId, setNftTokenId] = useState('');

  // Initialize Web3 and the contract
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
  const nftContract = new web3.eth.Contract(nftAbi.nftAbi, NFT_CONTRACT_ADDRESS);

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (nftTokenId) {
      try {
        const accounts = await web3.eth.getAccounts(); // Get the current user's account

        // Check if any accounts are returned
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
        await depositNFTToPrizePool(NFT_CONTRACT_ADDRESS, nftTokenId);
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
      await withdrawNFTFromPrizePool(index);
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
        <label className={style.rafflefeetitle} htmlFor="nftTokenId">
              Token ID:
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
              Check your NFT Token ID in your BipBoi!
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
