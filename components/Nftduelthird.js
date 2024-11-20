import React, { useState, useEffect } from 'react';
import style from '../styles/nftduel.module.css';
import { useAppContext } from '../context/context';
import { useNftContext } from '../context/NftContext'; // Import the context
import nftAbi from '../utils/nft'; // Import ABI
import Web3 from 'web3'; // Import Web3

const NFT_CONTRACT_ADDRESS = '0x7424C334EC67DB47768189696813248bf1a16675'; // Fixed contract address
const APPROVE_ADDRESS = '0x0230959cB5fF0BEa92f49e8bddA49e44446a4768'; // LOTTERY CONTRACT Address to approve
const TARGET_CHAIN_ID = '0x138D4'; // Chain ID 80084 in hexadecimal

const NftDuel = () => {
  const { depositNFTToPrizePoolThird, withdrawNFTFromPrizePoolThird, nftFirstDepositorThird } = useAppContext();
  const { nftTokenId, setNftTokenId } = useNftContext(); // Use the context
  const [nftContract, setNftContract] = useState(null);
  const [loadingDeposit, setLoadingDeposit] = useState(false); // Loading state for deposit
  const [loadingWithdraw, setLoadingWithdraw] = useState(false); // Loading state for withdraw
  const [isDepositor, setIsDepositor] = useState(false); // Track if the current user is the depositor

  // Initialize Web3 and the contract
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

  useEffect(() => {
    setNftContract(new web3.eth.Contract(nftAbi.nftAbi, NFT_CONTRACT_ADDRESS));
  }, []);

  useEffect(() => {
    const checkDepositor = async () => {
      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0];
      setIsDepositor(currentAccount === nftFirstDepositorThird); // Check if the current user is the depositor
    };
    checkDepositor();
  }, [nftFirstDepositorThird]);

  // Function to check and switch to the correct network
  const checkAndSwitchNetwork = async () => {
    try {
      const currentChainId = await web3.eth.getChainId();
      if (currentChainId !== parseInt(TARGET_CHAIN_ID, 16)) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: TARGET_CHAIN_ID }],
        });
        return false; // Network was incorrect, switched it
      }
      return true; // Network is correct
    } catch (error) {
      console.error('Failed to switch network:', error);
      alert('Please switch to the correct network.');
      return false; // Network is incorrect
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (nftTokenId && nftContract) {
      const isCorrectNetwork = await checkAndSwitchNetwork();
      if (!isCorrectNetwork) return; // Exit if the network is not correct

      try {
        const accounts = await web3.eth.getAccounts(); // Get the current user's account

        if (accounts.length === 0) {
          alert('Please connect your wallet.');
          return;
        }

        console.log('Approving NFT...');
        setLoadingDeposit(true); // Set loading state to true during the deposit process

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
      } finally {
        setLoadingDeposit(false); // Reset loading state after deposit attempt
      }
    } else {
      alert('Please provide an NFT Token ID.');
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();

    const isCorrectNetwork = await checkAndSwitchNetwork();
    if (!isCorrectNetwork) return; // Exit if the network is not correct

    try {
      setLoadingWithdraw(true); // Set loading state to true during the withdrawal process

      const index = 0; // Always use index 0 for withdrawal
      await withdrawNFTFromPrizePoolThird(index);
      console.log('Withdrawal successful.');

    } catch (error) {
      console.error('Error processing withdrawal:', error);
      alert('An error occurred: ' + error.message);
    } finally {
      setLoadingWithdraw(false); // Reset loading state after withdrawal attempt
    }
  };

  return (
    <div className={style.parentcontainer}>
      <div className={style.wrappernft}>

        <h2 className={style.title} style={{ textDecoration: 'underline' }}>NFT DUEL</h2>

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
              disabled={loadingDeposit} // Disable button while loading
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
              {loadingDeposit ? (
                <div className={style.loadingCircle}></div>
              ) : (
                <div className={style.btn}>WAGER</div>
              )}
            </button>
          </div>
        </form>

        <form onSubmit={handleWithdraw}>
          <div className={style.parentcontainer}>
            <button
              type="submit"
              disabled={loadingWithdraw} // Disable button while loading
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
              {loadingWithdraw ? (
                <div className={style.loadingCircle}></div>
              ) : (
                <div className={style.btn}>WITHDRAW NFT</div>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default NftDuel;
