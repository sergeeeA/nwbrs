import React, { useState, useEffect } from 'react';
import style from '../styles/nftduel.module.css';
import { useAppContext } from '../context/context';
import { useNftContext } from '../context/NftContext';
import nftAbi from '../utils/nft';
import Web3 from 'web3';

const NFT_CONTRACT_ADDRESS = '0x4Ae3985e45784CB73e1886AC603B5FEed4F08a05';
const APPROVE_ADDRESS = '0x67701281266d13C2Bca291c5Aa9faBb74c9d8B91';
const TARGET_CHAIN_ID = '0x138D4'; // Chain ID 80084 in hexadecimal

const NftDuel = () => {
  const { depositNFTToPrizePool, withdrawNFTFromPrizePool, nftFirstDepositor, fetchNftPrizePoolTokenId } = useAppContext();

  const [nftContract, setNftContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isDepositor, setIsDepositor] = useState(false);

  //coldown
  const [lastInventoryFetchTime, setLastInventoryFetchTime] = useState(0);
  const [fetchedTokenId, setFetchedTokenId] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(0); // Track the last fetch time

  // New UX improvement
  const { nftTokenId, setNftTokenId } = useNftContext();

  const [additionalNftInventory, setAdditionalNftInventory] = useState([]); // Fetch additional NFTs
  const [connectedAddress, setConnectedAddress] = useState(null); // To track the connected address
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

  useEffect(() => {
    const loadAccount = async () => {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        setConnectedAddress(accounts[0]); // Set the connected account
      } else {
        setConnectedAddress(null); // Reset if no account is connected
      }
    };
    loadAccount();

    const initContract = async () => {
      const contract = new web3.eth.Contract(nftAbi.nftAbi, NFT_CONTRACT_ADDRESS);
      setNftContract(contract);
    };
    initContract();
  }, []);

  useEffect(() => {
    const checkDepositor = async () => {
      if (connectedAddress) {
        setIsDepositor(connectedAddress === nftFirstDepositor); // Check if the connected address is the depositor
      }
    };
    checkDepositor();
  }, [connectedAddress, nftFirstDepositor]);

//TOKEN ID FOR % CHANCES

const fetchTokenId = async () => {
  const currentTime = Date.now();
  const cooldownPeriod = 11000; // 11 secondss


  if (currentTime - lastFetchTime < cooldownPeriod) {

    return;
  }

  try {
    const tokenId = await fetchNftPrizePoolTokenId(0); 
    if (!tokenId) {

      return; 
    }
    setFetchedTokenId(tokenId);
    setLastFetchTime(currentTime); 
 
  } catch (error) {

  }
};


useEffect(() => {
  fetchTokenId(); 
}, [lastFetchTime]); 

  // NFT HOLDINGSSSS
  const fetchAdditionalNFTInventory = async () => {
    const currentTime = Date.now();
    const cooldownPeriod = 11000;
 
    if (currentTime - lastInventoryFetchTime < cooldownPeriod) {
    
      return;
    }
  
    try {
      const address = connectedAddress;
      const response = await fetch(`https://api.routescan.io/v2/network/testnet/evm/80084/etherscan/api?module=account&action=addresstokennftinventory&address=${address}&contractaddress=0x4Ae3985e45784CB73e1886AC603B5FEed4F08a05&page=1&offset=100&apikey=YourApiKeyToken`);
      const data = await response.json();
      
      if (data.status === "1") {
        setAdditionalNftInventory(data.result || []);
      }
  
      
      setLastInventoryFetchTime(currentTime);
    } catch (err) {
  
    }
  };
  const checkAndSwitchNetwork = async () => {
    try {
      const currentChainId = await web3.eth.getChainId();
      if (currentChainId !== parseInt(TARGET_CHAIN_ID, 16)) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: TARGET_CHAIN_ID }],
        });
        return false; 
      }
      return true; 
    } catch (error) {
      console.error('Failed to switch network:', error);
      alert('Please switch to the correct network.');
      return false;
    }
  };

  const handleDeposit = async (e, selectedTokenId) => {
    e.preventDefault();

    if (isDepositor) {
      console.log('You cannot deposit again. You are the first depositor.');
      return;
    }

    if (selectedTokenId && nftContract) {
      const isCorrectNetwork = await checkAndSwitchNetwork();
      if (!isCorrectNetwork) return;

      try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
          alert('Please connect your wallet.');
          return;
        }

        console.log('Approving NFT...');
        setLoading(true);

        const approveResult = await nftContract.methods.approve(APPROVE_ADDRESS, selectedTokenId).send({ from: accounts[0] });
        console.log('Approval result:', approveResult);

        console.log('Approval successful. Depositing NFT...');
        await depositNFTToPrizePool(NFT_CONTRACT_ADDRESS, selectedTokenId);
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
    if (!isCorrectNetwork) return; 

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
        {/* Conditionally hide dropdown if the connected address is the depositor */}
        {connectedAddress !== nftFirstDepositor && (
          <select
            value={nftTokenId}
            onChange={async (e) => {
              const selectedTokenId = e.target.value;
              console.log('Selected Token ID:', selectedTokenId);  
              
              setNftTokenId(selectedTokenId);  // Update with the selected token ID
              
              // Handle deposit and reset nftTokenId to 0 after processing
              if (selectedTokenId !== "") {
                await handleDeposit(e, selectedTokenId);

                // Reset nftTokenId after the deposit is handled successfully
                setNftTokenId(0);
              }
            }}
            onClick={async () => {
              await fetchAdditionalNFTInventory();
  
            }}
            className={style.dropdown}
          >
            <option value="">Select NFT to wager</option>
            {additionalNftInventory
  .sort((a, b) => Number(b.TokenId) - Number(a.TokenId)) // Sort by TokenId in descending order
  .map((nft) => {
    if (fetchedTokenId !== null && fetchedTokenId !== undefined) {
      // Ensure both are numbers before adding
      const nftTokenIdValue = Number(nft.TokenId);  // Make sure it's a number
      const totalTokenId = nftTokenIdValue + Number(fetchedTokenId);  // Correct numeric addition

      const calculation = (nftTokenIdValue / totalTokenId) * 100;  // Perform the calculation

      // Determine the font color based on the percentage value
      let fontColor = '';
      if (calculation >= 66) {
        fontColor = '#00ff00'; // Neon Green
      } 
      else if (calculation >= 46) {
        fontColor = '#ffff00'; // Neon Yellow
      } else if (calculation >= 26) {
        fontColor = '#ff6600'; // Neon Orange
      } else {
        fontColor = '#ff0000'; // Neon Red
      }

      return (
        <option key={nft.TokenId} value={nft.TokenId} style={{ color: fontColor }}>
          {nft.TokenId} - {calculation.toFixed(1)}%{/* Correct percentage calculation */}
        </option>
      );
    } else {
      return (
        <option key={nft.TokenId} value={nft.TokenId}>
          {nft.TokenId} 
        </option>
      );
    }
  })}




          </select>
        )}

        {loading && (
          <div className={style.loadingCircle}></div>
        )}

        {isDepositor && (
          <form onSubmit={handleWithdraw}>
            <div className={style.parentcontainer}>
              <button
                type="submit"
                disabled={loading || isWithdrawing}
                style={{
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
        )}
      </div>
    </div>
  );
};

export default NftDuel;
