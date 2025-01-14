import React, { useState, useEffect } from 'react';
import style from '../styles/koth.module.css';
import { useAppContext } from '../context/context';
import { useNftContext } from '../context/NftContext';
import nftAbi from '../utils/nft';
import Web3 from 'web3';

const NFT_CONTRACT_ADDRESS = '0x7424C334EC67DB47768189696813248bf1a16675';
const APPROVE_ADDRESS = '0x67701281266d13C2Bca291c5Aa9faBb74c9d8B91';

const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

const Revshare = () => {
  const { address, BurnNFT, 
    userAddresses, 
    userValues, 
    userlistCount, 
    sharepoolBalance, 
    fetchUserList,
    fetchSharepoolBalance } = useAppContext();

  const { nftTokenId, setNftTokenId } = useNftContext();
  const [nftContract, setNftContract] = useState(null);
  const [loading, setLoading] = useState(false); 
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
  const [additionalNftInventory, setAdditionalNftInventory] = useState([]);

  useEffect(() => {
    const contract = new web3.eth.Contract(nftAbi.nftAbi, NFT_CONTRACT_ADDRESS);
    setNftContract(contract);
    fetchSharepoolBalance();
  }, [fetchSharepoolBalance]);


  
  const handleSubmit = async (e, selectedTokenId) => {
    e.preventDefault();
    if (selectedTokenId && nftContract) {
      try {
        const accounts = await web3.eth.getAccounts();
          
        if (accounts.length === 0) {
          alert('Please connect your wallet.');
          return;
        }
  
        setLoading(true); 
        const approveResult = await nftContract.methods.approve(APPROVE_ADDRESS, selectedTokenId).send({ from: accounts[0] });

      
        await BurnNFT(selectedTokenId);
  
        // Call updateData only after the successful submission and NFT burn
        await fetchUserList();
 
        
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
  // FETCH NFT HOLDINGS FOR CONECTED WALLET
  const fetchAdditionalNFTInventory = async () => {
    try {
      const address = await web3.eth.getAccounts(); // Get the current account
      const response = await fetch(`https://api.routescan.io/v2/network/testnet/evm/80084/etherscan/api?module=account&action=addresstokennftinventory&address=${address[0]}&contractaddress=0x7424C334EC67DB47768189696813248bf1a16675&page=1&offset=100&apikey=YourApiKeyToken`);
      const data = await response.json();
      if (data.status === "1") {
        setAdditionalNftInventory(data.result || []);
      } else {
        setAdditionalError('Failed to fetch additional NFT inventory');
      }
    } catch (err) {
      console.error('Error fetching additional NFT inventory:', err);
    }
  };

  
  const totalUserValues = userValues ? userValues.reduce((total, value) => total + parseFloat(value), 0) : 0;

  // CALCULATION OF EACH USERS SHARE BURNED/TOTALBURNED = %
  const userShares = userValues && totalUserValues > 0
    ? userValues.map(value => {
        const proportion = parseFloat(value) / totalUserValues;
        return proportion * sharepoolBalance; // user's share of the pool
      })
    : [];

 // ISOLATE coeNNECTED WALLET FOR INFO
 const connectedWalletIndex = userAddresses ? userAddresses.indexOf(address) : -1;
 const connectedUserValue = connectedWalletIndex >= 0 ? userValues[connectedWalletIndex] : 0;
 const connectedUserShare = connectedWalletIndex >= 0 ? userShares[connectedWalletIndex] : 0;
    
  return (
    <div className={style.parentcontainer}>



      
      <div className={style.wrappernft}>
      <label className={style.title} htmlFor="nftTokenId">
          BURN TO EARN
        </label>
        <p className={style.Info}>REWARDS: {sharepoolBalance ? `${sharepoolBalance} BERA` : 'Loading...'}</p>
    

 
          <div className={style.wrapper}>
          <div className={style.scrollableList}>
            <div className={style.numberInput}>
              {/* LISTS OF WALLET FOR BURN NFT */}
            
                {userAddresses && userAddresses.length > 0 ? (
                  <div>
                    {userAddresses.map((address, index) => (
                      <li className={style.numberInput} key={index}>
                        {formatAddress(address)} ({userValues[index]} NFTs) ({userShares[index] ? `${userShares[index].toFixed(2)} BERA` : '0'})
                      </li>
                    ))}
                  </div>
                ) : (
                  <p>No users available.</p> 
                )}
              </div>
              </div>
          </div>
          <p className={style.InfoSmol}>TOTAL USERS: {userlistCount}</p> 
        <p className={style.InfoSmol}>TOTAL NFTs BURNED: {totalUserValues ? `${totalUserValues} NFTS` : '...'}</p>

        </div>


      <div className={style.wrappernft}>
        <select
          value={nftTokenId}
          onChange={async (e) => {
            const selectedTokenId = e.target.value;
            console.log('Selected Token ID:', selectedTokenId);  
            setNftTokenId(selectedTokenId);  

            await handleSubmit(e, selectedTokenId); 
          }}
          onClick={fetchAdditionalNFTInventory} // shkibidi
          className={style.dropdown}
        > 
          <option value="">Select NFT to BURN</option>
          {additionalNftInventory.map((nft) => (
            <option key={nft.TokenId} value={nft.TokenId}>
              {nft.TokenId}
            </option>
          ))}
        </select>
                
             {/* CONENCTED WALLET INFO*/}
             {address && (
          <div>

            <p className={style.InfoSmol}>
              YOU BURNED: {connectedUserValue} NFTs
            </p>
            <p className={style.InfoSmol}>
              YOUR SHARE ≈ {connectedUserShare ? `${connectedUserShare.toFixed(2)} BERA` : '0 BERA'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Revshare;
