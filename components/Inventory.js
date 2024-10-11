import { useState, useEffect } from 'react';
import Style from '../styles/Inventory.module.css';
import { useAppContext } from '../context/context';
import { useNftContext } from '../context/NftContext';

export default function Inventory() {
  const [nftInventory, setNftInventory] = useState([]);
  const [newNftInventory, setNewNftInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newLoading, setNewLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newError, setNewError] = useState(null);

  const { address } = useAppContext();
  const { setNftTokenId } = useNftContext();

  const fetchNFTInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.routescan.io/v2/network/testnet/evm/80084/etherscan/api?module=account&action=addresstokennftinventory&address=${address}&contractaddress=0x4Ae3985e45784CB73e1886AC603B5FEed4F08a05&page=1&offset=100&apikey=YourApiKeyToken`);
      const data = await response.json();
      if (data.status === "1") {
        setNftInventory(data.result || []);
      } else {
        setError('Failed to fetch NFT inventory');
      }
    } catch (err) {
      setError('Failed to fetch NFT inventory');
      console.error('Error fetching NFT inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewNFTInventory = async () => {
    setNewLoading(true);
    setNewError(null);
    try {
      const response = await fetch(`https://api.routescan.io/v2/network/testnet/evm/80084/etherscan/api?module=account&action=addresstokennftinventory&address=${address}&contractaddress=0x46B4b78d1Cd660819C934e5456363A359fde43f4&page=1&offset=100&apikey=YourApiKeyToken`);
      const data = await response.json();
      if (data.status === "1") {
        setNewNftInventory(data.result || []);
      } else {
        setNewError('Failed to fetch new NFT inventory');
      }
    } catch (err) {
      setNewError('Failed to fetch new NFT inventory');
      console.error('Error fetching new NFT inventory:', err);
    } finally {
      setNewLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      fetchNFTInventory();
      fetchNewNFTInventory();

      const intervalId = setInterval(() => {
        fetchNFTInventory();
        fetchNewNFTInventory();
      }, 10000); // Refresh every 10 seconds

      return () => clearInterval(intervalId); // Clean up the interval on unmount
    }
  }, [address]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setNftTokenId(text);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy Token ID. Please try again.');
      });
  };

  return (
    <div className={Style.chatbox}>
      <p className={Style.nft}>BERA DWELLERS</p>
      <div>
        {error && <p className={Style.message}>{error}</p>}
        {nftInventory.length > 0 ? (
          <div className={Style.gridContainer}>
            {nftInventory.map((nft, index) => (
              <div className={Style.gridItem} key={index} onClick={() => copyToClipboard(nft.TokenId)}>
                <p className={Style.message}>{nft.TokenId}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className={Style.message}>No NFTs found</p>
        )}
      </div>
      <div>
        <p className={Style.nft2}>BERAMONIUM bARTIOSIS</p>
        {newError && <p className={Style.message}>{newError}</p>}
        {newNftInventory.length > 0 ? (
          <div className={Style.gridContainer}>
            {newNftInventory.map((nft, index) => (
              <div className={Style.gridItem2} key={index} onClick={() => copyToClipboard(nft.TokenId)}>
                <p className={Style.message}>{nft.TokenId}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className={Style.message}>No NFTs found</p>
        )}
      </div>
    </div>
  );
}
