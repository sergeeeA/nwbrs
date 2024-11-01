import React, { useState, useEffect } from 'react';
import style from '../styles/nftduel.module.css';
import { useAppContext } from '../context/context';
import { useNftContext } from '../context/NftContext';
import nftAbi from '../utils/nft';
import Web3 from 'web3';

const NFT_CONTRACT_ADDRESS = '0x4Ae3985e45784CB73e1886AC603B5FEed4F08a05';
const APPROVE_ADDRESS = '0x0230959cB5fF0BEa92f49e8bddA49e44446a4768';
const TARGET_CHAIN_ID = '0x138D4'; // Chain ID 80084 in hexadecimal

const NftDuel = () => {
  const { depositNFTToPrizePool, withdrawNFTFromPrizePool, nftFirstDepositor } = useAppContext();
  const { nftTokenId, setNftTokenId } = useNftContext();
  const [nftContract, setNftContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isDepositor, setIsDepositor] = useState(false);

  const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

  useEffect(() => {
    const initContract = async () => {
      const contract = new web3.eth.Contract(nftAbi.nftAbi, NFT_CONTRACT_ADDRESS);
      setNftContract(contract);
    };
    initContract();
  }, []);

  useEffect(() => {
    const checkDepositor = async () => {
      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0];
      setIsDepositor(currentAccount === nftFirstDepositor);
    };
    checkDepositor();
  }, [nftFirstDepositor]);

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
    if (isDepositor) {
      console.log('You cannot deposit again. You are the first depositor.');
      return; // Early exit if the user is the first depositor
    }

    if (nftTokenId && nftContract) {
      const isCorrectNetwork = await checkAndSwitchNetwork();
      if (!isCorrectNetwork) return; // Exit if the network is not correct

      try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
          alert('Please connect your wallet.');
          return;
        }

        console.log('Approving NFT...');
        setLoading(true);

        const approveResult = await nftContract.methods.approve(APPROVE_ADDRESS, nftTokenId).send({ from: accounts[0] });
        console.log('Approval result:', approveResult);

        console.log('Approval successful. Depositing NFT...');
        await depositNFTToPrizePool(NFT_CONTRACT_ADDRESS, nftTokenId);
        console.log('Deposit successful.');
      } catch (error) {
        console.error('Error processing transaction:', error);
        alert('An error occurred: ' + error.message);
      } finally {
        setLoading(false);
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
      const index = 0;
      setIsWithdrawing(true);
      await withdrawNFTFromPrizePool(index);
      console.log('Withdrawal successful.');
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      alert('An error occurred: ' + error.message);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className={style.parentcontainer}>
      <div className={style.wrappernft}>
        <h2 className={style.title} style={{ textDecoration: 'underline' }}>NFT DUEL</h2>

        <label className={style.rafflefeetitle} htmlFor="nftTokenId" style={{ cursor: 'url("/curs.png"), auto' }}>
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
              className={style.numberInput}
            />
            <div className={style.tooltiptext}>
              Click any token ID in your NFT Inventory!
            </div>
          </div>
          <div className={style.parentcontainer}>
            {/* Conditionally render the deposit button */}
            {!isDepositor && (
              <button
                type="submit"
                disabled={loading} // Disable if loading
                style={{
                  width: '50%',
                  height: '40%',
                  padding: '10px 10px',
                  backgroundColor: 'transparent',
                  color: '#C8AC53',
                  fontSize: '20px',
                  fontFamily: 'Monofonto',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                  transformOrigin: 'center',
                  cursor: 'url("/curs.png"), auto',
                }}
              >
                {loading ? (
                  <div className={style.loadingCircle}></div>
                ) : (
                  <div className={style.btn}>WAGER</div>
                )}
              </button>
            )}
          </div>
        </form>

        <form onSubmit={handleWithdraw}>
          <div className={style.parentcontainer}>
            <button
              type="submit"
              disabled={loading || isWithdrawing}
              style={{
                width: '60%',
                height: '40%',
                padding: '10px 10px',
                backgroundColor: 'transparent',
                color: '#C8AC53',
                fontSize: '20px',
                fontFamily: 'Monofonto',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'center',
                boxSizing: 'border-box',
                transformOrigin: 'center',
                cursor: 'url("/curs.png"), auto',
              }}
            >
              {isWithdrawing ? (
                <div className={style.loadingCircle}></div>
              ) : (
                <div className={style.btn}>WITHDRAW</div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NftDuel;
