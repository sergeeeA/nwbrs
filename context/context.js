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

  //plyaers
  const [lotteryPlayers, setLotteryPlayers] = useState([]);
  const [nftLotteryPlayers, setNftLotteryPlayers] = useState([]);
  //lederbrd
  const [leaderboardAddresses, setLeaderboardAddresses] = useState([]);
  const [leaderboardScores, setLeaderboardScores] = useState([]);
  //lederbrdKOTH
  const [kothLeaderboardAddresses, setKothLeaderboardAddresses] = useState([]);
  const [kothLeaderboardScores, setKothLeaderboardScores] = useState([]);

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

 //ROUNDS
 const [miniGameRounds, setMiniGameRounds] = useState([]);
 const [miniGameNFTRounds, setMiniGameNFTRounds] = useState([]);
 const [nftPrizeRounds, setNftPrizeRounds] = useState([]);
 const [nftPrizeSecondRounds, setNftPrizeSecondRounds] = useState([]);
 const [nftPrizeThirdRounds, setNftPrizeThirdRounds] = useState([]);


  const fetchLotteryData = async () => {
    try {
      const data = await updateLottery(); // Call the backend function
      setLotteryPot(data.lotteryPot);
      setMiniGamePool(data.miniGamePool);
      setLastWinner(data.lastWinner);
      setLastMiniGameWinner(data.lastMiniGameWinner);
      setMiniGameNFTTokenId(data.miniGameNFTTokenId);
      setMiniGameNFTfirstDepositor(data.miniGameNFTfirstDepositor);
      setLastMiniGameNFTWinner(data.lastMiniGameNFTWinner);
      setNftTokenId(data.nftTokenId); // Add nftTokenId
      setLastNFTLotteryWinner(data.lastNFTLotteryWinner); // Add lastNFTLotteryWinner
    } catch (error) {

    }
  };

  useEffect(() => {
    fetchLotteryData(); // Fetch data on initial load
  }, []);



  const refreshData = async () => {
    if (lotteryContract && address) {
      try {
        console.log('Refreshing data...');
  
        // Group 1
        await Promise.all([
          fetchNftPrizePoolTokenId(0),
          fetchNFTFirstDepositor(),
          fetchLastNFTPrizeWinner(),
          fetchNftPrizePoolContract(),
    
          
        ]);
  
        // Wait 2 seconds before fetching the next group
        await new Promise((resolve) => setTimeout(resolve, 1500));
  
        // Group 2
        await Promise.all([
          fetchNftPrizePoolTokenIdSecond(0),
          fetchLastNFTPrizeWinnerSecond(),
          fetchNftPrizePoolContractSecond(),
          fetchNFTFirstDepositorSecond(),
          
          
        ]);
  
        // Wait 2 seconds before fetching the last group
        await new Promise((resolve) => setTimeout(resolve, 2000));
  
        // Group 3
        await Promise.all([
          fetchLeaderboardKOTH(),
          fetchLeaderboard(),
          fetchNftPrizePoolContractThird(),
          fetchNFTFirstDepositorThird(),
          fetchLastNFTPrizeWinnerThird(),
           fetchNftPrizePoolTokenIdThird(0),
        ]);
        
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    }
  };
  
  const refreshDataWithInterval = async () => {
    await refreshData(); // Refresh data
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
  const fetchLeaderboardKOTH = async () => {
    if (lotteryContract) {
      try {
        const response = await lotteryContract.methods.getLeaderboardKOTH().call();
        const addresses = response[0];
        const scores = response[1];
        
        setKothLeaderboardAddresses(addresses);
        setKothLeaderboardScores(scores);
        
        console.log('Fetched KOTH leaderboard:', addresses, scores);
      } catch (error) {
        console.error('Error fetching KOTH leaderboard:', error);
      }
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      // Group 1
      updateLottery();
      if (address) {
        await Promise.all([
          fetchLastWinner(),
          fetchLastNFTLotteryWinner(),
        ]);
  
        // Wait 2 seconds before fetching the next group
        await new Promise((resolve) => setTimeout(resolve, 1000));
  
        // Group 2
        await Promise.all([
          fetchNFTTokenId(),
          fetchLastNFTLotteryWinner(),
          fetchFirstDepositor(),
          
        ]);
  
        // Wait 2 seconds before fetching the next group
        await new Promise((resolve) => setTimeout(resolve, 1000));
  
        // Group 3
        await Promise.all([
          fetchLastMiniGameWinner(),

        ]);
  
        // Wait 2 seconds before fetching the last group
        await new Promise((resolve) => setTimeout(resolve, 1000));
  
        // Group 4
        await Promise.all([

          fetchLeaderboard(),
          fetchLeaderboardKOTH(),

          fetchMiniGameNFTFirstDepositor(),
          fetchMiniGameNFTTokenId(),
          fetchLastMiniGameNFTWinner(),
          

       
        ]);

        await new Promise((resolve) => setTimeout(resolve, 1000));
  
        // Group 5
        //await Promise.all([
          
          //fetchNftPrizePoolTokenId(0),
          //fetchLastNFTPrizeWinner(),
          //fetchLastNFTPrizeWinnerSecond(),
          //fetchNftPrizePoolTokenIdSecond(0),
      
          //fetchNftPrizePoolContract(),
          //fetchNftPrizePoolContractSecond(),
    
          //fetchNFTFirstDepositor(),
          //fetchNFTFirstDepositorSecond(),
        

          //fetchLastNFTPrizeWinnerThird(),
          //fetchNFTFirstDepositorThird(),
          //fetchNftPrizePoolContractThird(),

       
        //]);
        
      }
    };
  
    fetchData();
  }, [lotteryContract, address]);

  const updateLottery = async () => {
    if (!lotteryContract) return;
  
    try {
      const pot = await lotteryContract.methods.getLotteryBalance().call();
      const pool = await lotteryContract.methods.getMiniGamePool().call();
      const lotteryId = await lotteryContract.methods.lotteryId().call();
      const winner = await lotteryContract.methods.lastWinner().call();
      const miniGameWinner = await lotteryContract.methods.lastMiniGameWinner().call();
      const miniGameNFTWinner = await lotteryContract.methods.lastMiniGameNFTWinner().call();
      const MiniGameNFTfirstDepositor = await lotteryContract.methods.MiniGameNFTfirstDepositor().call();
      const MiniGameNFTTokenId = await lotteryContract.methods.miniGameNFTTokenId().call();
      // Fetch the first depositor
      await fetchFirstDepositor();

      
      setLotteryPot(web3.utils.fromWei(pot, 'ether'));
      setMiniGamePool(web3.utils.fromWei(pool, 'ether'));
      setLotteryId(lotteryId);
      setLastWinner(winner);
      setLastMiniGameWinner(miniGameWinner); 
      setLastMiniGameNFTWinner(miniGameNFTWinner);
      setMiniGameNFTfirstDepositor(MiniGameNFTfirstDepositor);
      setMiniGameNFTTokenId(MiniGameNFTTokenId);
      console.log('Last winner set to:', winner); // Debugging line
    } catch (error) {
      console.error('Error fetching lottery data:', error);
    }
  };

  const fetchAllMiniGameRounds = async () => {
    if (lotteryContract) {
      try {
        const allRoundsData = [];
        let index = 0; // Start from index 0

        while (true) { // Infinite loop, will break when no valid round data is found
          try {
            const roundData = await lotteryContract.methods.minigameRounds(index).call();

            // Check for valid data (adjust according to your contract's return values)
            if (roundData.winner !== '0x0000000000000000000000000000000000000000') {
              allRoundsData.push(roundData); // Add valid round data to the array
              index++; // Move to the next index
            } else {
              break; // Exit loop if no valid data is found
            }
          } catch (innerError) {
            
            break; // Exit loop if there's an error fetching the round
          }
        }
        setMiniGameRounds(allRoundsData); // Update state with the valid rounds
      } catch (error) {

      }
    }
  };
  
  const fetchAllMiniGameNFTRounds = async () => {
    if (lotteryContract) {
      try {
        const allNFTRoundsData = [];
        let index = 0;

        while (true) {
          try {
            const nftRoundData = await lotteryContract.methods.miniGameNFTRounds(index).call();
            if (nftRoundData.winner !== '0x0000000000000000000000000000000000000000') {
              allNFTRoundsData.push(nftRoundData);
              index++;
            } else {
              break;
            }
          } catch (innerError) {
            break;
          }
        }
        setMiniGameNFTRounds(allNFTRoundsData);
      } catch (error) {
        // Handle error if needed
      }
    }
  };

  const fetchAllNftPrizeRounds = async () => {
    if (nftPrizePoolContract) {
      try {
        const allRoundsData = [];
        let index = 0; // Start from index 0
  
        while (true) { // Infinite loop, will break when no valid round data is found
          try {
            const roundData = await lotteryContract.methods.nftPrizeRounds(index).call();
  
            // Check for valid data (adjust according to your contract's return values)
            if (roundData.winner !== '0x0000000000000000000000000000000000000000') {
              allRoundsData.push(roundData); // Add valid round data to the array
              index++; // Move to the next index
            } else {
              break; // Exit loop if no valid data is found
            }
          } catch (innerError) {
            break; // Exit loop if there's an error fetching the round
          }
        }
        setNftPrizeRounds(allRoundsData); // Update state with the valid rounds
      } catch (error) {
        // Handle any errors here if necessary
      }
    }
  };
  const fetchAllNftPrizeSecondRounds = async () => {
    if (nftPrizePoolContractSecond) {
      try {
        const allRoundsData = [];
        let index = 0; // Start from index 0
  
        while (true) { // Infinite loop, will break when no valid round data is found
          try {
            const roundData = await lotteryContract.methods.nftPrizeSecondRounds(index).call();
  
            // Check for valid data (adjust according to your contract's return values)
            if (roundData.winner !== '0x0000000000000000000000000000000000000000') {
              allRoundsData.push(roundData); // Add valid round data to the array
              index++; // Move to the next index
            } else {
              break; // Exit loop if no valid data is found
            }
          } catch (innerError) {
            break; // Exit loop if there's an error fetching the round
          }
        }
        setNftPrizeSecondRounds(allRoundsData); // Update state with the valid rounds
      } catch (error) {
        // Handle any errors here if necessary
      }
    }
  };
  const fetchAllNftPrizeThirdRounds = async () => {
    if (nftPrizePoolContractSecond) {
      try {
        const allRoundsData = [];
        let index = 0; // Start from index 0
  
        while (true) { // Infinite loop, will break when no valid round data is found
          try {
            const roundData = await lotteryContract.methods.nftPrizeThirdRounds(index).call();
  
            // Check for valid data (adjust according to your contract's return values)
            if (roundData.winner !== '0x0000000000000000000000000000000000000000') {
              allRoundsData.push(roundData); // Add valid round data to the array
              index++; // Move to the next index
            } else {
              break; // Exit loop if no valid data is found
            }
          } catch (innerError) {
            break; // Exit loop if there's an error fetching the round
          }
        }
        setNftPrizeThirdRounds(allRoundsData); // Update state with the valid rounds
      } catch (error) {
        // Handle any errors here if necessary
      }
    }
  };

  const fetchLotteryPlayers = async () => {
    if (lotteryContract) {
      try {
        const players = [];
        let index = 0; // Start from index 0
        while (true) { // Infinite loop, will break when no player is found
          try {
            const player = await lotteryContract.methods.lotteryPlayers(index).call();
            if (player !== '0x0000000000000000000000000000000000000000') {
              players.push(player); // Add valid player to the array
              index++; // Move to the next index
            } else {
              break; // Exit loop if the address is zero
            }
          } catch (innerError) {
            console.warn(`Error fetching player at index ${index}:`, innerError);
            break; // Exit loop if there's an error fetching the player
          }
        }
        setLotteryPlayers(players); // Update state with the valid players
      } catch (error) {
        console.error('Error fetching lottery players:', error);
      }
    }
  };
  const fetchNftLotteryPlayers = async () => {
    if (lotteryContract) {
      try {
        const players = [];
        let index = 0; // Start from index 0
        while (true) { // Infinite loop, will break when no player is found
          try {
            const player = await lotteryContract.methods.nftLotteryPlayers(index).call();
            if (player !== '0x0000000000000000000000000000000000000000') {
              players.push(player); // Add valid player to the array
              index++; // Move to the next index
            } else {
              break; // Exit loop if the address is zero
            }
          } catch (innerError) {
            console.warn(`Error fetching NFT lottery player at index ${index}:`, innerError);
            break; // Exit loop if there's an error fetching the player
          }
        }
        setNftLotteryPlayers(players); // Update state with the valid players
      } catch (error) {
        console.error('Error fetching NFT lottery players:', error);
      }
    }
  };
  
  
  //LAST WINNERS//
  const fetchLastWinner = async () => {
    if (lotteryContract) {
      try {
        const winner = await lotteryContract.methods.lastWinner().call();
        setLastWinner(winner);
        console.log('Last winner set to:', winner); // Debugging line
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
  const fetchNftPrizePoolTokenId = async (index) => {
    console.log('Fetching token ID for index:', index);
    try {
        const tokenId = await lotteryContract.methods.nftPrizePoolTokenIds(index).call();
        return tokenId;
    } catch (error) {
    
        return null; // Return null for invalid indices
    }
  };
  const fetchNftPrizePoolTokenIdSecond = async (index) => {
    try {
        const tokenId = await lotteryContract.methods.nftPrizePoolTokenIdsSecond(index).call();
        return tokenId;
    } catch (error) {

        return null;
    }
};
const fetchNftPrizePoolTokenIdThird = async (index) => {
  try {
      const tokenId = await lotteryContract.methods.nftPrizePoolTokenIdsThird(index).call();
      return tokenId;
  } catch (error) {

      return null;
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
        
        const estimatedGas = await lotteryContract.methods.depositNFTToPrizePool(nftContractAddress, nftTokenId).estimateGas({
          from: address,
          value: web3.utils.toWei('1', 'ether'), // Send 1 ether
        });
  
        const gasPrice = await web3.eth.getGasPrice();
  
        await lotteryContract.methods.depositNFTToPrizePool(nftContractAddress, nftTokenId).send({
          from: address,
          gas: estimatedGas,
          value: web3.utils.toWei('1', 'ether'), // Entry fee
          gasPrice,
        });
  
        console.log('NFT deposited successfully');
        refreshDataWithInterval(); 
      } catch (err) {
        console.error('Error depositing NFT to prize pool:', err);
        alert('Transaction failed: ' + err.message);
      }
    }
  };
  
  const depositNFTToPrizePoolSecond = async (nftContractAddress, nftTokenId) => {
    if (lotteryContract) {
      try {
        console.log('Depositing NFT to prize pool second');
        
        const estimatedGas = await lotteryContract.methods.depositNFTToPrizePoolSecond(nftContractAddress, nftTokenId).estimateGas({
          from: address,
          value: web3.utils.toWei('1', 'ether'), // Send 1 ether
        });
  
        const gasPrice = await web3.eth.getGasPrice();
  
        await lotteryContract.methods.depositNFTToPrizePoolSecond(nftContractAddress, nftTokenId).send({
          from: address,
          gas: estimatedGas,
          value: web3.utils.toWei('1', 'ether'), // Entry fee
          gasPrice,
        });
  
        console.log('NFT deposited successfully (second)');
        refreshDataWithInterval(); 
      } catch (err) {
        console.error('Error depositing NFT to prize pool second:', err);
        alert('Transaction failed: ' + err.message);
      }
    }
  };
  
  const depositNFTToPrizePoolThird = async (nftContractAddress, nftTokenId) => {
    if (lotteryContract) {
      try {
        console.log('Depositing NFT to prize pool third');
  

        const estimatedGas = await lotteryContract.methods.depositNFTToPrizePoolThird(nftContractAddress, nftTokenId).estimateGas({
          from: address,
          value: web3.utils.toWei('1', 'ether'), // Send 1 ether
        });
  
 
        const gasPrice = await web3.eth.getGasPrice();
  
        console.log('Estimated gas:', estimatedGas);
        console.log('Sending value: 1 Ether');
  

        await lotteryContract.methods.depositNFTToPrizePoolThird(nftContractAddress, nftTokenId).send({
          from: address,
          value: web3.utils.toWei('1', 'ether'), // Send 1 ether
          gas: estimatedGas,
          gasPrice,
        });
  
        console.log('NFT deposited successfully (third)');
        refreshDataWithInterval(); // If needed, refresh data after successful deposit
      } catch (err) {
        console.error('Error depositing NFT:', err);
        alert('Transaction failed: ' + err.message);
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
const enterKOTH = async (tokenId) => {
  if (lotteryContract && address) {
    try {
      const value = web3.utils.toWei('0.5', 'ether'); // Entry fee
      
      // Estimate the gas for the transaction
      const estimatedGas = await lotteryContract.methods.KOTH(tokenId).estimateGas({
        from: address,
        value,
      });

      await lotteryContract.methods.KOTH(tokenId).send({
        from: address,
        value,
        gas: estimatedGas,
      });

      console.log(`Entered KOTH with tokenId: ${tokenId}`);
      refreshData(); // Refresh data after entry
    } catch (error) {
      console.error('Error entering KOTH:', error);
    }
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
        //tab refresh data
        fetchLotteryData,
        refreshData,

        address,
        connectWallet,
        lotteryPot,
        miniGamePool,

        lotteryPlayers, // Add lotteryPlayers here
        fetchLotteryPlayers, // If you want to expose the fetch function
        nftLotteryPlayers, // New NFT lottery players
        fetchNftLotteryPlayers,
        
        enterLottery,
        duel,
        duelnft,
        enterNFT,
        lotteryId,
        //koth
        enterKOTH,

        kothLeaderboardAddresses,
        kothLeaderboardScores,
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

        fetchNftPrizePoolTokenId,
        fetchNftPrizePoolTokenIdSecond,
        fetchNftPrizePoolTokenIdThird,
        depositNFTToPrizePool, 
        depositNFTToPrizePoolSecond, // New function
        depositNFTToPrizePoolThird, // New function
        withdrawNFTFromPrizePool, 
        withdrawNFTFromPrizePoolSecond,
        withdrawNFTFromPrizePoolThird,
        nftPrizePoolContract, 
        nftPrizePoolContractSecond,
        nftPrizePoolContractThird,

        //ROUNDS
        miniGameRounds, // Expose the minigame rounds data
        fetchAllMiniGameRounds, // Expose the fetch function
        miniGameNFTRounds,
        fetchAllMiniGameNFTRounds,
        nftPrizeRounds, // Expose the nftPrizeRounds data
        fetchAllNftPrizeRounds, // Expose the fetch function
        nftPrizeSecondRounds, // Expose the nftPrizeSecondRounds data
        fetchAllNftPrizeSecondRounds, // Expose the fetch function for second rounds
        nftPrizeThirdRounds,
        fetchAllNftPrizeThirdRounds,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(appContext);
};
