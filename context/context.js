import { createContext, useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import createLotteryContract from '../utils/lottery';

export const appContext = createContext();

export const AppProvider = ({ children }) => {
  const [web3, setWeb3] = useState();
  const [address, setAddress] = useState('');
  const [lotteryContract, setLotteryContract] = useState();
  const [lotteryPot, setLotteryPot] = useState();
  const [miniGamePool, setMiniGamePool] = useState();
  const [getLotteryPlayers, setPlayers] = useState([]);
  const [lastWinner, setLastWinner] = useState([]);
  const [lotteryId, setLotteryId] = useState();
  const [etherscanUrl, setEtherscanUrl] = useState();
  const [nftTokenId, setNftTokenId] = useState(); 
  const [miniGameNFTTokenId, setMiniGameNFTTokenId] = useState(); 
  const [firstDepositor, setFirstDepositor] = useState(''); 
  const [miniGameNFTfirstDepositor, setMiniGameNFTfirstDepositor] = useState(''); 
  const [nftContract, setNftContract] = useState(''); 
  const [nftPrizePoolContract, setNftPrizePoolContract] = useState(''); 
  const [nftFirstDepositor, setNftFirstDepositor] = useState(''); 
  const [lastNFTPrizeWinner, setLastNFTPrizeWinner] = useState(''); 
  const [playerWinsNFTduel, setPlayerWins] = useState(); // New state for player wins
  const [playerTotaWins, setPlayerTotalWins] = useState(); 
  const [playerWinsLottery, setPlayerWinsLottery] = useState(); // New state for player wins lottery
  const [playerWinsMiniGame, setPlayerWinsMiniGame] = useState(); // New state for player wins mini game
  const [playerWinsMiniGameNFT, setPlayerWinsMiniGameNFT] = useState(); // New state for player wins mini game NFT
  const [playerWinsNFTLottery, setPlayerWinsNFTLottery] = useState(); // New state for player wins NFT lottery


  useEffect(() => {
    updateLottery();
    if (address) {
      fetchNFTTokenId();
      fetchMiniGameNFTTokenId(); 
      fetchFirstDepositor(); 
      fetchMiniGameNFTFirstDepositor(); 
      fetchNftPrizePoolContract(); 
      fetchNFTFirstDepositor(); 
      fetchLastNFTPrizeWinner();
      fetchPlayerWins(address);
      fetchPlayerTotalWins(address);
      fetchPlayerWinsLottery(address); // Fetch player wins lottery
      fetchPlayerWinsMiniGame(address); // Fetch player wins mini game
      fetchPlayerWinsMiniGameNFT(address); // Fetch player wins mini game NFT
      fetchPlayerWinsNFTLottery(address); // Fetch player wins NFT lottery // Fetch player wins on address change
    }
  }, [lotteryContract, address]);

  const updateLottery = async () => {
    if (lotteryContract) {
      try {
        const pot = await lotteryContract.methods.getLotteryBalance().call();
        setLotteryPot(web3.utils.fromWei(pot, 'ether'));

        const pool = await lotteryContract.methods.getMiniGamePool().call();
        setMiniGamePool(web3.utils.fromWei(pool, 'ether'));

        setPlayers(await lotteryContract.methods.getPlayers().call());
        setLotteryId(await lotteryContract.methods.lotteryId().call());
        setLastWinner(await lotteryContract.methods.getWinners().call());
        console.log([...lastWinner], 'Last Winners');
      } catch (error) {
        console.error('Error fetching lottery data:', error);
      }
    }
  };
  const fetchPlayerWinsLottery = async (playerAddress) => {
    if (lotteryContract && playerAddress) {
      try {
        console.log('Fetching player wins lottery for address:', playerAddress);
        const lotteryWins = await lotteryContract.methods.playerWinsLottery(playerAddress).call();
        console.log('Fetched player wins lottery:', lotteryWins);
        setPlayerWinsLottery(lotteryWins);
      } catch (error) {
        console.error('Error fetching player wins lottery:', error);
      }
    }
  };

  const fetchPlayerWinsMiniGame = async (playerAddress) => {
    if (lotteryContract && playerAddress) {
      try {
        console.log('Fetching player wins mini game for address:', playerAddress);
        const wins = await lotteryContract.methods.playerWinsMiniGame(playerAddress).call();
        console.log('Fetched player wins mini game:', wins);
        setPlayerWinsMiniGame(wins);
      } catch (error) {
        console.error('Error fetching player wins mini game:', error);
      }
    }
  };

  const fetchPlayerWinsMiniGameNFT = async (playerAddress) => {
    if (lotteryContract && playerAddress) {
      try {
        console.log('Fetching player wins mini game NFT for address:', playerAddress);
        const wins = await lotteryContract.methods.playerWinsMiniGameNFT(playerAddress).call();
        console.log('Fetched player wins mini game NFT:', wins);
        setPlayerWinsMiniGameNFT(wins);
      } catch (error) {
        console.error('Error fetching player wins mini game NFT:', error);
      }
    }
  };

  const fetchPlayerWinsNFTLottery = async (playerAddress) => {
    if (lotteryContract && playerAddress) {
      try {
        console.log('Fetching player wins NFT lottery for address:', playerAddress);
        const wins = await lotteryContract.methods.playerWinsNFTLottery(playerAddress).call();
        console.log('Fetched player wins NFT lottery:', wins);
        setPlayerWinsNFTLottery(wins);
      } catch (error) {
        console.error('Error fetching player wins NFT lottery:', error);
      }
    }
  };

  // New function to fetch player wins
  const fetchPlayerWins = async (playerAddress) => {
    if (lotteryContract && playerAddress) {
      try {
        console.log('Fetching player wins for address:', playerAddress);
        const wins = await lotteryContract.methods.playerWinsNFTduel(playerAddress).call();
        console.log('Fetched player wins:', wins);
        setPlayerWins(wins);
      } catch (error) {
        console.error('Error fetching player wins:', error);
      }
    }
  };
  const fetchPlayerTotalWins = async (playerAddress) => {
    if (lotteryContract && playerAddress) {
      try {
        console.log('Fetching player total wins for address:', playerAddress);
        const totalwins = await lotteryContract.methods.playerTotaWins(playerAddress).call();
        console.log('Fetched player total wins:', totalwins); // Debugging line
        setPlayerTotalWins(totalwins);
      } catch (error) {
        console.error('Error fetching player total wins:', error);
      }
    }
  };
  

  const fetchNFTTokenId = async () => {
    if (lotteryContract && address) {
      try {
        console.log('Fetching NFT token ID for address:', address);
        const tokenId = await lotteryContract.methods.nftTokenId().call({ from: address });
        console.log('Fetched NFT token ID:', tokenId);
        setNftTokenId(tokenId); 
      } catch (error) {
        console.error('Error fetching NFT token ID:', error);
      }
    }
  };

  const fetchMiniGameNFTTokenId = async () => {
    if (lotteryContract && address) {
      try {
        console.log('Fetching MiniGame NFT token ID for address:', address);
        const tokenId = await lotteryContract.methods.miniGameNFTTokenId().call({ from: address });
        console.log('Fetched MiniGame NFT token ID:', tokenId);
        setMiniGameNFTTokenId(tokenId); 
      } catch (error) {
        console.error('Error fetching MiniGame NFT token ID:', error);
      }
    }
  };

  const fetchFirstDepositor = async () => {
    if (lotteryContract) {
      try {
        console.log('Fetching first depositor');
        const depositor = await lotteryContract.methods.miniGameFirstDepositor().call();
        console.log('Fetched first depositor:', depositor);
        setFirstDepositor(depositor); 
      } catch (error) {
        console.error('Error fetching first depositor:', error);
      }
    }
  };

  const fetchMiniGameNFTFirstDepositor = async () => {
    if (lotteryContract) {
      try {
        console.log('Fetching MiniGameNFT first depositor');
        const depositor = await lotteryContract.methods.MiniGameNFTfirstDepositor().call();
        console.log('Fetched MiniGameNFT first depositor:', depositor);
        setMiniGameNFTfirstDepositor(depositor); 
      } catch (error) {
        console.error('Error fetching MiniGameNFT first depositor:', error);
      }
    }
  };

  const fetchNftPrizePoolContract = async () => {
    if (lotteryContract) {
      try {
        console.log('Fetching NFT prize pool contract');
        const contractAddress = await lotteryContract.methods.nftPrizePoolContract().call();
        console.log('Fetched NFT prize pool contract:', contractAddress);
        setNftPrizePoolContract(contractAddress); 
      } catch (error) {
        console.error('Error fetching NFT prize pool contract:', error);
      }
    }
  };

  const fetchNFTFirstDepositor = async () => {
    if (lotteryContract) {
      try {
        console.log('Fetching NFT first depositor');
        const depositor = await lotteryContract.methods.NFTFirstDepositor().call();
        console.log('Fetched NFT first depositor:', depositor);
        setNftFirstDepositor(depositor); 
      } catch (error) {
        console.error('Error fetching NFT first depositor:', error);
      }
    }
  };

  const fetchLastNFTPrizeWinner = async () => {
    if (lotteryContract) {
      try {
        console.log('Fetching last NFT prize winner');
        const winner = await lotteryContract.methods.lastNFTPrizeWinner().call();
        console.log('Fetched last NFT prize winner:', winner);
        setLastNFTPrizeWinner(winner); 
      } catch (error) {
        console.error('Error fetching last NFT prize winner:', error);
      }
    }
  };

  const depositNFTToPrizePool = async (nftContractAddress, nftTokenId) => {
    if (lotteryContract) {
      try {
        console.log('Depositing NFT to prize pool');
        await lotteryContract.methods.depositNFTToPrizePool(nftContractAddress, nftTokenId).send({
          from: address,
          gas: 300000,
          gasPrice: null,
        });
        console.log('NFT deposited successfully');
      } catch (err) {
        console.error('Error depositing NFT to prize pool:', err);
      }
    }
  };

  const withdrawNFTFromPrizePool = async (index) => {
    if (lotteryContract) {
      try {
        console.log('Withdrawing NFT from prize pool');
        await lotteryContract.methods.withdrawNFTFromPrizePool(index).send({
          from: address,
          gas: 300000,
          gasPrice: null,
        });
        console.log('NFT withdrawn successfully');
      } catch (err) {
        console.error('Error withdrawing NFT from prize pool:', err);
      }
    }
  };

  const enterLottery = async () => {
    try {
      console.log('Entering lottery');
      await lotteryContract.methods.enter().send({
        from: address,
        value: '250000000000000000',
        gas: 300000,
        gasPrice: null,
      });
      updateLottery();
    } catch (err) {
      console.error('Error entering lottery:', err);
    }
  };

  const duel = async () => {
    try {
      console.log('Entering duel');
      await lotteryContract.methods.enterMiniGame().send({
        from: address,
        value: '1000000000000000000',
        gas: 300000,
        gasPrice: null,
      });
      updateLottery();
    } catch (err) {
      console.error('Error entering duel:', err);
    }
  };

  const duelnft = async () => {
    try {
      console.log('Entering duel');
      await lotteryContract.methods.enterMiniGameNFT().send({
        from: address,
        value: '1000000000000000000',
        gas: 300000,
        gasPrice: null,
      });
      updateLottery();
    } catch (err) {
      console.error('Error entering duel:', err);
    }
  };

  const enterNFT = async () => {
    try {
      console.log('Entering NFT lottery');
      await lotteryContract.methods.enterNFTLottery().send({
        from: address,
        value: '250000000000000000',
        gas: 300000,
        gasPrice: null,
      });
      updateLottery();
    } catch (err) {
      console.error('Error entering NFT lottery:', err);
    }
  };

  const pickWinner = async () => {
    try {
      let tx = await lotteryContract.methods.pickWinner().send({
        from: address,
        gas: 300000,
        gasPrice: null,
      });
      console.log(tx);
      setEtherscanUrl('https://ropsten.etherscan.io/tx/' + tx.transactionHash);
      updateLottery();
    } catch (err) {
      console.error('Error picking winner:', err);
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
        setLotteryContract(createLotteryContract(web3));
        window.ethereum.on('accountsChanged', async () => {
          const accounts = await web3.eth.getAccounts();
          setAddress(accounts[0]);
        });
      } catch (err) {
        console.error('Error connecting wallet:', err);
      }
    } else {
      console.error('Please install MetaMask');
    }
  };

  return (
    <appContext.Provider
      value={{
        address,
        connectWallet,
        lotteryPot,
        miniGamePool,
        getLotteryPlayers,
        enterLottery,
        duel,
        duelnft,
        enterNFT,
        pickWinner,
        lotteryId,
        lastWinner,
        etherscanUrl,
        nftTokenId, 
        miniGameNFTTokenId, 
        firstDepositor, 
        miniGameNFTfirstDepositor, 
        nftFirstDepositor, 
        depositNFTToPrizePool, 
        withdrawNFTFromPrizePool, 
        nftPrizePoolContract, 
        lastNFTPrizeWinner, 
        playerWinsNFTduel,
        playerWinsLottery,
        playerWinsMiniGame,
        playerWinsMiniGameNFT,
        playerTotaWins,
        playerWinsNFTLottery,
        fetchPlayerWins,
        fetchPlayerTotalWins ,
        fetchPlayerWinsLottery,
        fetchPlayerWinsMiniGame,
        fetchPlayerWinsMiniGameNFT,
        fetchPlayerWinsNFTLottery

      }}
    >
      {children}
    </appContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(appContext);
};
