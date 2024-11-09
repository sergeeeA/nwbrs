import { useState, useEffect } from 'react';
import Style from '../styles/Inventory.module.css';
import { useAppContext } from '../context/context';
import nftAbiData from '../utils/nft'; // Import the ABI object
import Web3 from 'web3';

const contractAddress = '0x4Ae3985e45784CB73e1886AC603B5FEed4F08a05';

export default function Claim() {
  const { address } = useAppContext(); // Get the user's address from context
  const [web3, setWeb3] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
      } else {
        setErrorMessage('Ethereum provider not found. Please install a wallet like MetaMask.');
      }
    };
    initWeb3();
  }, []);

  const handleClaim = async () => {
    console.log('Attempting to claim NFTs...');
    setErrorMessage('');
    setLoading(true);

    const _quantity = web3.utils.toBN(10); // Set quantity directly in hexadecimal (10 in decimal)
    const _currency = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'; // Native token
    const _pricePerToken = 0; // Assuming the claim is free

    // Update to use actual proof values
    const _allowlistProof = {
      proof: [
        '0x0000000000000000000000000000000000000000000000000000000000000000', // Replace with a valid proof
      ],
      quantityLimitPerWallet: 1,
      pricePerToken: _pricePerToken,
      currency: _currency,
    };

    const _data = '0x'; // Ensure this is properly formatted as bytes

    try {
      if (!web3) {
        throw new Error('Web3 not initialized.');
      }

      if (!address) {
        throw new Error('User address not found. Make sure you are connected to MetaMask.');
      }

      const contract = new web3.eth.Contract(nftAbiData.nftAbi, contractAddress);

      // Log parameters before sending
      console.log(`Claiming NFTs with parameters:
        Receiver: ${address}
        Quantity: ${_quantity}
        Currency: ${_currency}
        Price per Token: ${_pricePerToken}
        Allowlist Proof: ${JSON.stringify(_allowlistProof)}
        Data: ${_data}`);

      // Estimate gas
      const gasEstimate = await contract.methods.claim(
        address,
        _quantity,
        _currency,
        _pricePerToken,
        _allowlistProof,
        _data
      ).estimateGas({ from: address });

      console.log(`Estimated gas: ${gasEstimate}`);

      // Send the transaction
      const tx = await contract.methods.claim(
        address,
        _quantity,
        _currency,
        _pricePerToken,
        _allowlistProof,
        _data
      ).send({ from: address, value: 0, gas: gasEstimate });

      console.log('Claim successful!', tx);
    } catch (err) {
      console.error('Error claiming NFT:', err);
      setErrorMessage(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Style.claimContainer}>
      <button onClick={handleClaim} disabled={loading}>
        {loading ? 'Claiming...' : 'Claim NFTs'}
      </button>

    </div>
  );
}
