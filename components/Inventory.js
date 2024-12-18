import { useState, useEffect } from 'react';
import Style from '../styles/Inventory.module.css';
import { useAppContext } from '../context/context';
import { useNftContext } from '../context/NftContext';

export default function Inventory() {
  const [nftInventory, setNftInventory] = useState([]);
  const [newNftInventory, setNewNftInventory] = useState([]);
  const [additionalNftInventory, setAdditionalNftInventory] = useState([]); // New state for additional NFTs
  const [loading, setLoading] = useState(false);
  const [newLoading, setNewLoading] = useState(false);
  const [additionalLoading, setAdditionalLoading] = useState(false); // Loading state for the new NFTs
  const [error, setError] = useState(null);
  const [newError, setNewError] = useState(null);
  const [additionalError, setAdditionalError] = useState(null); // Error state for the new NFTs

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

  const fetchAdditionalNFTInventory = async () => {  // New function to fetch NFTs from the new contract
    setAdditionalLoading(true);
    setAdditionalError(null);
    try {
      const response = await fetch(`https://api.routescan.io/v2/network/testnet/evm/80084/etherscan/api?module=account&action=addresstokennftinventory&address=${address}&contractaddress=0x7424C334EC67DB47768189696813248bf1a16675&page=1&offset=100&apikey=YourApiKeyToken`);
      const data = await response.json();
      if (data.status === "1") {
        setAdditionalNftInventory(data.result || []);
      } else {
        setAdditionalError('Failed to fetch additional NFT inventory');
      }
    } catch (err) {
      setAdditionalError('Failed to fetch additional NFT inventory');
      console.error('Error fetching additional NFT inventory:', err);
    } finally {
      setAdditionalLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      fetchNFTInventory();
      fetchNewNFTInventory();
      fetchAdditionalNFTInventory();  // Call the new fetch function

      const intervalId = setInterval(() => {
        fetchNFTInventory();
        fetchNewNFTInventory();
        fetchAdditionalNFTInventory();  // Refresh the new NFTs as well
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

      <div>
        <p className={Style.nft3}>BERA OUTLAWS</p> {/* Added section title */}
        {additionalError && <p className={Style.message}>{additionalError}</p>}
        {additionalNftInventory.length > 0 ? (
          <div className={Style.gridContainer}>
            {additionalNftInventory.map((nft, index) => (
              <div className={Style.gridItem3} key={index} onClick={() => copyToClipboard(nft.TokenId)}>
                <p className={Style.message}>{nft.TokenId}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className={Style.message}>No additional NFTs found</p>
        )}
      </div>
    </div>
  );
}
