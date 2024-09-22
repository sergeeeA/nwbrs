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

  // New state for leaderboard
  const [leaderboardAddresses, setLeaderboardAddresses] = useState([]);
  const [leaderboardScores, setLeaderboardScores] = useState([]);

  const [lotteryId, setLotteryId] = useState();
  const [etherscanUrl, setEtherscanUrl] = useState();
  const [nftTokenId, setNftTokenId] = useState(); 
  const [miniGameNFTTokenId, setMiniGameNFTTokenId] = useState(); 
  const [firstDepositor, setFirstDepositor] = useState(''); 
  const [miniGameNFTfirstDepositor, setMiniGameNFTfirstDepositor] = useState(''); 
  const [nftContract, setNftContract] = useState(''); 
  const [nftPrizePoolContract, setNftPrizePoolContract] = useState(''); 
  const [nftPrizePoolContractSecond, setNftPrizePoolContractSecond] = useState(''); 
  const [nftPrizePoolContractThird, setNftPrizePoolContractThird] = useState('');
  const [nftFirstDepositor, setNftFirstDepositor] = useState(''); 
  const [nftFirstDepositorSecond, setNftFirstDepositorSecond] = useState(''); // New state
  const [nftFirstDepositorThird, setNftFirstDepositorThird] = useState('');
  //LAST WINNERS
  const [lastWinner, setLastWinner] = useState([]);
  const [lastMiniGameWinner, setLastMiniGameWinner] = useState('');
  const [lastMiniGameNFTWinner, setLastMiniGameNFTWinner] = useState('');
  const [lastNFTLotteryWinner, setLastNFTLotteryWinner] = useState('');
  const [lastNFTPrizeWinner, setLastNFTPrizeWinner] = useState(''); 
  const [lastNFTPrizeWinnerSecond, setLastNFTPrizeWinnerSecond] = useState(''); // New state
  const [lastNFTPrizeWinnerThird, setLastNFTPrizeWinnerThird] = useState(''); // New state
  
  const [playerWinsNFTduel, setPlayerWins] = useState(); // New state for player wins
  const [playerTotaWins, setPlayerTotalWins] = useState(); 
  const [playerWinsLottery, setPlayerWinsLottery] = useState(); // New state for player wins lottery
  const [playerWinsMiniGame, setPlayerWinsMiniGame] = useState(); // New state for player wins mini game
  const [playerWinsMiniGameNFT, setPlayerWinsMiniGameNFT] = useState(); // New state for player wins mini game NFT
  const [playerWinsNFTLottery, setPlayerWinsNFTLottery] = useState(); // New state for player wins NFT lottery

  const refreshData = async () => {
    if (lotteryContract && address) {
      try {
        console.log('Refreshing data...');
        await updateLottery(); // Assuming this updates the lottery state
        await fetchNFTTokenId();
        await fetchMiniGameNFTTokenId();
        await fetchFirstDepositor();
        await fetchMiniGameNFTFirstDepositor();
        await fetchNftPrizePoolContract();
        await fetchNftPrizePoolContractSecond();
        await fetchNftPrizePoolContractThird();
        await fetchNFTFirstDepositor();
        await fetchNFTFirstDepositorSecond();
        await fetchNFTFirstDepositorThird();

        await updateLottery();
        await fetchLeaderboard();

        await fetchLastNFTLotteryWinner();
        await fetchLastNFTPrizeWinner();
        await fetchLastNFTPrizeWinnerSecond();
        await fetchLastNFTPrizeWinnerThird();
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    }
  };
  
  const refreshDataWithInterval = () => {
    let callCount = 0;
  
    const intervalId = setInterval(async () => {
      if (callCount < 1) {
        await refreshData(); // Refresh data
        callCount++;
      } else {
        clearInterval(intervalId); // Stop after 2 calls
      }
    }, 500); // 0.5 seconds
  };
  
  const fetchLeaderboard = async () => {
    if (lotteryContract) {
      try {
        const response = await lotteryContract.methods.getLeaderboard().call();
        // Access the arrays directly from the Result object
        const addresses = response[0]; // First array
        const scores = response[1]; // Second array
        
        // Ensure that the values are set correctly
        setLeaderboardAddresses(addresses);
        setLeaderboardScores(scores);
        
        console.log('Fetched leaderboard:', addresses, scores);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    }
  };
  
  useEffect(() => {
    updateLottery();
    if (address) {
      fetchNFTTokenId();
      fetchMiniGameNFTTokenId(); 
      fetchFirstDepositor(); 
      fetchMiniGameNFTFirstDepositor(); 
      fetchNftPrizePoolContract(); 
      fetchNftPrizePoolContractSecond();
      fetchNftPrizePoolContractThird();
      fetchNFTFirstDepositor(); 
      fetchNFTFirstDepositorSecond();
      fetchNFTFirstDepositorThird();
      //lederbord
      fetchLeaderboard();
      //LAST WINNERS
      fetchLastWinner();
      fetchLastMiniGameWinner();
      fetchLastMiniGameNFTWinner();
      fetchLastNFTLotteryWinner();
      fetchLastNFTPrizeWinner();
      fetchLastNFTPrizeWinnerSecond(); // New function
      fetchLastNFTPrizeWinnerThird(); // New function
      //STATS
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
  //LAST WINNERS//
  const fetchLastWinner = async () => {
    if (lotteryContract) {
      try {
        console.log('Fetching last winner');
        const winner = await lotteryContract.methods.lastWinner().call();
        console.log('Fetched last winner:', winner);
        setLastWinner(winner);
      } catch (error) {
        console.error('Error fetching last winner:', error);
      }
    }
  };
  
  const fetchLastMiniGameWinner = async () => {
    if (lotteryContract) {
      try {
        console.log('Fetching last mini game winner');
        const winner = await lotteryContract.methods.lastMiniGameWinner().call();
        console.log('Fetched last mini game winner:', winner);
        setLastMiniGameWinner(winner);
      } catch (error) {
        console.error('Error fetching last mini game winner:', error);
      }
    }
  };
  
  const fetchLastMiniGameNFTWinner = async () => {
    if (lotteryContract) {
      try {
        console.log('Fetching last mini game NFT winner');
        const winner = await lotteryContract.methods.lastMiniGameNFTWinner().call();
        console.log('Fetched last mini game NFT winner:', winner);
        setLastMiniGameNFTWinner(winner);
      } catch (error) {
        console.error('Error fetching last mini game NFT winner:', error);
      }
    }
  };
  
  const fetchLastNFTLotteryWinner = async () => {
    if (lotteryContract) {
      try {
        console.log('Fetching last NFT lottery winner');
        const winner = await lotteryContract.methods.lastNFTLotteryWinner().call();
        console.log('Fetched last NFT lottery winner:', winner);
        setLastNFTLotteryWinner(winner);
      } catch (error) {
        console.error('Error fetching last NFT lottery winner:', error);
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
  const fetchNftPrizePoolContractSecond = async () => {
    if (lotteryContract) {
      try {
        console.log('Fetching NFT prize pool contract second');
        const contractAddress = await lotteryContract.methods.nftPrizePoolContractSecond().call();
        console.log('Fetched NFT prize pool contract second:', contractAddress);
        setNftPrizePoolContractSecond(contractAddress); 
      } catch (error) {
        console.error('Error fetching NFT prize pool contract second:', error);
      }
    }
  };
  
  const fetchNftPrizePoolContractThird = async () => {
    if (lotteryContract) {
      try {
        console.log('Fetching NFT prize pool contract third');
        const contractAddress = await lotteryContract.methods.nftPrizePoolContractThird().call();
        console.log('Fetched NFT prize pool contract third:', contractAddress);
        setNftPrizePoolContractThird(contractAddress); 
      } catch (error) {
        console.error('Error fetching NFT prize pool contract third:', error);
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
  const fetchNFTFirstDepositorSecond = async () => {
    if (lotteryContract) {
      try {
        console.log('Fetching NFT first depositor second');
        const depositor = await lotteryContract.methods.NFTFirstDepositorSecond().call();
        console.log('Fetched NFT first depositor second:', depositor);
        setNftFirstDepositorSecond(depositor);
      } catch (error) {
        console.error('Error fetching NFT first depositor second:', error);
      }
    }
  };

  const fetchNFTFirstDepositorThird = async () => {
    if (lotteryContract) {
      try {
        console.log('Fetching NFT first depositor third');
        const depositor = await lotteryContract.methods.NFTFirstDepositorThird().call();
        console.log('Fetched NFT first depositor third:', depositor);
        setNftFirstDepositorThird(depositor);
      } catch (error) {
        console.error('Error fetching NFT first depositor third:', error);
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
  const fetchLastNFTPrizeWinnerSecond = async () => {
    if (lotteryContract) {
      try {
        console.log('Fetching last NFT prize winner second');
        const winner = await lotteryContract.methods.lastNFTPrizeWinnerSecond().call();
        console.log('Fetched last NFT prize winner second:', winner);
        setLastNFTPrizeWinnerSecond(winner);
      } catch (error) {
        console.error('Error fetching last NFT prize winner second:', error);
      }
    }
  };

  const fetchLastNFTPrizeWinnerThird = async () => {
    if (lotteryContract) {
      try {
        console.log('Fetching last NFT prize winner third');
        const winner = await lotteryContract.methods.lastNFTPrizeWinnerThird().call();
        console.log('Fetched last NFT prize winner third:', winner);
        setLastNFTPrizeWinnerThird(winner);
      } catch (error) {
        console.error('Error fetching last NFT prize winner third:', error);
      }
    }
  };

  const depositNFTToPrizePool = async (nftContractAddress, nftTokenId) => {
    if (lotteryContract) {
      try {
        console.log('Depositing NFT to prize pool');
        
        // Estimate the gas for the transaction
        const estimatedGas = await lotteryContract.methods.depositNFTToPrizePool(nftContractAddress, nftTokenId).estimateGas({
          from: address,
        });
  
        // Send the transaction with the estimated gas
        await lotteryContract.methods.depositNFTToPrizePool(nftContractAddress, nftTokenId).send({
          from: address,
          gas: estimatedGas,
          gasPrice: null,
        });
  
        console.log('NFT deposited successfully');
        refreshDataWithInterval(); // Trigger refresh after this function
      } catch (err) {
        console.error('Error depositing NFT to prize pool:', err);
      }
    }
  };
  const depositNFTToPrizePoolSecond = async (nftContractAddress, nftTokenId) => {
    if (lotteryContract) {
      try {
        console.log('Depositing NFT to prize pool second');
        
        // Estimate the gas for the transaction
        const estimatedGas = await lotteryContract.methods.depositNFTToPrizePoolSecond(nftContractAddress, nftTokenId).estimateGas({
          from: address,
        });
  
        // Send the transaction with the estimated gas
        await lotteryContract.methods.depositNFTToPrizePoolSecond(nftContractAddress, nftTokenId).send({
          from: address,
          gas: estimatedGas,
          gasPrice: null,
        });
  
        console.log('NFT deposited successfully (second)');
        refreshDataWithInterval(); 
      } catch (err) {
        console.error('Error depositing NFT to prize pool second:', err);
      }
    }
  };
  
  const depositNFTToPrizePoolThird = async (nftContractAddress, nftTokenId) => {
    if (lotteryContract) {
      try {
        console.log('Depositing NFT to prize pool third');
        
        // Estimate the gas for the transaction
        const estimatedGas = await lotteryContract.methods.depositNFTToPrizePoolThird(nftContractAddress, nftTokenId).estimateGas({
          from: address,
        });
  
        // Send the transaction with the estimated gas
        await lotteryContract.methods.depositNFTToPrizePoolThird(nftContractAddress, nftTokenId).send({
          from: address,
          gas: estimatedGas,
          gasPrice: null,
        });
  
        console.log('NFT deposited successfully (third)');
        refreshDataWithInterval(); 
      } catch (err) {
        console.error('Error depositing NFT to prize pool third:', err);
      }
    }
  };
  

  const withdrawNFTFromPrizePool = async (index) => {
    if (lotteryContract) {
      try {
        console.log('Withdrawing NFT from prize pool');
        
        // Estimate the gas for the transaction
        const estimatedGas = await lotteryContract.methods.withdrawNFTFromPrizePool(index).estimateGas({
          from: address,
        });
  
        // Send the transaction with the estimated gas
        await lotteryContract.methods.withdrawNFTFromPrizePool(index).send({
          from: address,
          gas: estimatedGas,
          gasPrice: null,
        });
  
        console.log('NFT withdrawn successfully');
        refreshDataWithInterval(); 
      } catch (err) {
        console.error('Error withdrawing NFT from prize pool:', err);
      }
    }
  };
  
  const withdrawNFTFromPrizePoolSecond = async (index) => {
    if (lotteryContract) {
      try {
        console.log('Withdrawing NFT from prize pool second');
        
        // Estimate the gas for the transaction
        const estimatedGas = await lotteryContract.methods.withdrawNFTFromPrizePoolSecond(index).estimateGas({
          from: address,
        });
  
        // Send the transaction with the estimated gas
        await lotteryContract.methods.withdrawNFTFromPrizePoolSecond(index).send({
          from: address,
          gas: estimatedGas,
          gasPrice: null,
        });
  
        console.log('NFT withdrawn successfully (second)');
        refreshDataWithInterval(); 
      } catch (err) {
        console.error('Error withdrawing NFT from prize pool second:', err);
      }
    }
  };
  

  const withdrawNFTFromPrizePoolThird = async (index) => {
    if (lotteryContract) {
      try {
        console.log('Withdrawing NFT from prize pool third');
  
        // Estimate gas
        const estimatedGas = await lotteryContract.methods.withdrawNFTFromPrizePoolThird(index).estimateGas({
          from: address,
        });
  
        // Send the transaction with the estimated gas
        await lotteryContract.methods.withdrawNFTFromPrizePoolThird(index).send({
          from: address,
          gas: estimatedGas,
          gasPrice: null, // or specify a gas price if necessary
        });
  
        console.log('NFT withdrawn successfully (third)');
        refreshDataWithInterval(); 
      } catch (err) {
        console.error('Error withdrawing NFT from prize pool third:', err);
      }
    }
  };
  const enterLottery = async () => {
    try {
      console.log('Entering lottery');
  
      // Estimate gas
      const estimatedGas = await lotteryContract.methods.enter().estimateGas({
        from: address,
        value: '250000000000000000',
      });
  
      // Send the transaction with the estimated gas
      await lotteryContract.methods.enter().send({
        from: address,
        value: '250000000000000000',
        gas: estimatedGas,
        gasPrice: null, // or specify a gas price if necessary
      });
  
      updateLottery();
      refreshDataWithInterval(); 
    } catch (err) {
      console.error('Error entering lottery:', err);
    }
  };
  

  const duel = async () => {
    try {
      console.log('Entering duel');
  
      // Estimate gas
      const estimatedGas = await lotteryContract.methods.enterMiniGame().estimateGas({
        from: address,
        value: '1000000000000000000',
      });
  
      // Send the transaction with the estimated gas
      await lotteryContract.methods.enterMiniGame().send({
        from: address,
        value: '1000000000000000000',
        gas: estimatedGas,
        gasPrice: null, // or specify a gas price if necessary
      });
  
      updateLottery();
      refreshDataWithInterval(); 
    } catch (err) {
      console.error('Error entering duel:', err);
    }
  };

  const duelnft = async () => {
    try {
      console.log('Entering duel');
      
      // Estimate the gas for the transaction
      const estimatedGas = await lotteryContract.methods.enterMiniGameNFT().estimateGas({
        from: address,
        value: '1000000000000000000',
      });
  
      // Send the transaction with the estimated gas
      await lotteryContract.methods.enterMiniGameNFT().send({
        from: address,
        value: '1000000000000000000',
        gas: estimatedGas,
        gasPrice: null,
      });
      
      updateLottery();
      refreshDataWithInterval(); 
    } catch (err) {
      console.error('Error entering duel:', err);
    }
  };
  const enterNFT = async () => {
    try {
      console.log('Entering NFT lottery');
  
      // Estimate the gas for the transaction
      const estimatedGas = await lotteryContract.methods.enterNFTLottery().estimateGas({
        from: address,
        value: '250000000000000000',
      });
  
      await lotteryContract.methods.enterNFTLottery().send({
        from: address,
        value: '250000000000000000',
        gas: estimatedGas,
        gasPrice: null, // Optionally, you can set a specific gas price
      });
  
      updateLottery();
      refreshDataWithInterval(); 
    } catch (err) {
      console.error('Error entering NFT lottery:', err);
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
        lotteryId,

        // New leaderboard data
        leaderboardAddresses,
        leaderboardScores,
        //lastwinners
        lastWinner,
        lastMiniGameWinner,
        lastMiniGameNFTWinner,
        lastNFTLotteryWinner,
        lastNFTPrizeWinner, 
        lastNFTPrizeWinnerSecond, // New state
        lastNFTPrizeWinnerThird, // New state

        etherscanUrl,
        nftTokenId, 
        miniGameNFTTokenId, 
        firstDepositor, 
        miniGameNFTfirstDepositor, 
        nftFirstDepositor, 
        nftFirstDepositorSecond, // New state
        nftFirstDepositorThird, // New state
        depositNFTToPrizePool, 
        depositNFTToPrizePoolSecond, // New function
        depositNFTToPrizePoolThird, // New function
        withdrawNFTFromPrizePool, 
        withdrawNFTFromPrizePoolSecond,
        withdrawNFTFromPrizePoolThird,
        nftPrizePoolContract, 
        nftPrizePoolContractSecond,
        nftPrizePoolContractThird,

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
