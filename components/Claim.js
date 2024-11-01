import { useState, useEffect } from 'react';
import Style from '../styles/Inventory.module.css';
import { useAppContext } from '../context/context';
import nftAbi from '../utils/nft';
import Web3 from 'web3';

const createLotteryContract = (web3Instance) => {
  const contractAddress = '0x4Ae3985e45784CB73e1886AC603B5FEed4F08a05'; // Your NFT contract address
  return new web3Instance.eth.Contract(nftAbi, contractAddress);
};

export default function Claim() {
  const { accounts, connectWallet } = useAppContext();
  const [web3, setWeb3] = useState(null);
  const [lotteryContract, setLotteryContract] = useState(null);

  useEffect(() => {
    console.log('Connected accounts:', accounts); // Log connected accounts

    if (accounts && accounts.length > 0 && !web3) {
      const initWeb3 = async () => {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const contract = createLotteryContract(web3Instance);
        setLotteryContract(contract);
      };
      initWeb3();
    }
  }, [accounts, web3]);

  const handleClaim = async () => {
    if (!web3 || !lotteryContract) {
      console.error('Web3 or contract not initialized');
      return;
    }

    const _receiver = accounts[0];
    const _quantity = 10; // Adjust as necessary
    const _currency = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'; // Native token
    const _pricePerToken = 0; // Free
    const _allowlistProof = {
      proof: ['0x...'], // Your proof data here
      quantityLimitPerWallet: 10,
      pricePerToken: 0,
      currency: _currency,
    };
    const _data = '0x'; // Adjust if you have any data

    try {
      const tx = await lotteryContract.methods.claim(
        _receiver,
        _quantity,
        _currency,
        _pricePerToken,
        _allowlistProof,
        _data
      ).send({ from: _receiver, value: 0 }); // No payment since it's free

      console.log('Claim successful!', tx);
    } catch (err) {
      console.error('Error claiming NFT:', err);
    }
  };

  const handleConnectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      await connectWallet(); // Call the context's connectWallet function
    } else {
      console.error('Please install MetaMask');
    }
  };

  return (
    <div className={Style.claimContainer}>
      {accounts && accounts.length > 0 ? (
        <button onClick={handleClaim}>Claim NFTs</button>
      ) : (
        <button onClick={handleConnectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}
