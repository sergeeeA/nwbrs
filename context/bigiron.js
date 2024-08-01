import { createContext, useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import createSmartContract from '../utils/smartContract'; // Adjust this import according to your actual file structure

export const appContext = createContext();

export const AppProviders = ({ children }) => {
  const [web3, setWeb3] = useState();
  const [address, setAddress] = useState('');
  const [contract, setContract] = useState();
  const [depositAmount, setDepositAmount] = useState();
  const [lastWinner, setLastWinner] = useState();
  const [user1, setUser1] = useState();
  const [user2, setUser2] = useState();
  const [winnerChosen, setWinnerChosen] = useState();
  const [etherscanUrl, setEtherscanUrl] = useState();

  useEffect(() => {
    updateContractData();
  }, [contract]);

  const updateContractData = async () => {
    if (contract) {
      try {
        const depositAmt = await contract.methods.DEPOSIT_AMOUNT().call();
        const lastWin = await contract.methods.getLastWinner().call();
        const usr1 = await contract.methods.getUser1().call();
        const usr2 = await contract.methods.getUser2().call();
        const winnerStatus = await contract.methods.getWinnerChosenStatus().call();

        setDepositAmount(Web3.utils.fromWei(depositAmt, 'ether'));
        setLastWinner(lastWin);
        setUser1(usr1);
        setUser2(usr2);
        setWinnerChosen(winnerStatus);

      } catch (error) {
        console.log(error, 'updateContractData');
      }
    }
  };

  const deposit = async () => {
    try {
      await contract.methods.deposit().send({
        from: address,
        value: Web3.utils.toWei('0.01', 'ether'), // Adjust deposit amount if needed
        gas: 300000,
        gasPrice: null,
      });
      updateContractData();
    } catch (err) {
      console.log(err, 'deposit');
    }
  };

  const chooseWinner = async (winnerAddress) => {
    try {
      let tx = await contract.methods.chooseWinner(winnerAddress).send({
        from: address,
        gas: 300000,
        gasPrice: null,
      });
      setEtherscanUrl('https://etherscan.io/tx/' + tx.transactionHash);
      updateContractData();
    } catch (err) {
      console.log(err, 'chooseWinner');
    }
  };

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
        const accounts = await web3.eth.getAccounts();
        setAddress(accounts[0]);
        setContract(createSmartContract(web3));
        window.ethereum.on('accountsChanged', async () => {
          const accounts = await web3.eth.getAccounts();
          setAddress(accounts[0]);
        });
      } catch (err) {
        console.log(err, 'connectWallet');
      }
    } else {
      console.log('Please install MetaMask');
    }
  };

  return (
    <appContext.Provider
      value={{
        address,
        connectWallet,
        deposit,
        chooseWinner,
        depositAmount,
        lastWinner,
        user1,
        user2,
        winnerChosen,
        etherscanUrl,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(appContext);
};
