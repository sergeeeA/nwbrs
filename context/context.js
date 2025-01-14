import { createContext, useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import createLotteryContract from '../utils/lottery';

export const appContext = createContext();

export const AppProvider = ({ children }) => {
  const [web3, setWeb3] = useState();
  const [address, setAddress] = useState('');
  const [lotteryContract, setLotteryContract] = useState();
  const [lotteryPot, setLotteryPot] = useState();


  //CACHE for storing data

  //plyaers
  const [lotteryPlayers, setLotteryPlayers] = useState([]);
  const [nftLotteryPlayers, setNftLotteryPlayers] = useState([]);
  //lederbrd
  const [leaderboardAddresses, setLeaderboardAddresses] = useState([]);
  const [leaderboardScores, setLeaderboardScores] = useState([]);
  //lederbrdKOTH


 
  const [etherscanUrl, setEtherscanUrl] = useState();
  const [nftTokenId, setNftTokenId] = useState(); 
  

  const [nftPrizePoolContract, setNftPrizePoolContract] = useState(''); 
  const [nftPrizePoolContractSecond, setNftPrizePoolContractSecond] = useState(''); 
  const [nftPrizePoolContractThird, setNftPrizePoolContractThird] = useState('');
  const [nftFirstDepositor, setNftFirstDepositor] = useState(''); 
  const [nftFirstDepositorSecond, setNftFirstDepositorSecond] = useState(''); // New state
  const [nftFirstDepositorThird, setNftFirstDepositorThird] = useState('');
  //LAST WINNERS
  const [lastWinner, setLastWinner] = useState([]);

  const [lastNFTLotteryWinner, setLastNFTLotteryWinner] = useState('');
  const [lastNFTPrizeWinner, setLastNFTPrizeWinner] = useState(''); 
  const [lastNFTPrizeWinnerSecond, setLastNFTPrizeWinnerSecond] = useState(''); // New state
  const [lastNFTPrizeWinnerThird, setLastNFTPrizeWinnerThird] = useState(''); // New state

 //ROUNDS

 const [nftPrizeRounds, setNftPrizeRounds] = useState([]);
 const [nftPrizeSecondRounds, setNftPrizeSecondRounds] = useState([]);
 const [nftPrizeThirdRounds, setNftPrizeThirdRounds] = useState({ addresses1: [], addresses2: [] });


 
 //rev share
 const [sharepoolBalance, setSharepoolBalance] = useState();  
 const [userlistCount, setUserlistCount] = useState(0);
   const [userAddresses, setUserAddresses] = useState([]);
   const [userValues, setUserValues] = useState([]);


 const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));





  const refreshData = async () => {
    if (lotteryContract && address) {
      try {
        console.log('>>>>>NFT DUELS DATA<<<<<');
  
        // Group 1
        await Promise.all([

          fetchNftPrizePoolContract(),
          fetchNftPrizePoolContractSecond(),
          fetchNftPrizePoolContractThird(),
  
        ]);
  
        // Wait 2 seconds before fetching the next group
        await new Promise((resolve) => setTimeout(resolve, 1100));
        
        
    
          await Promise.all([
            fetchNftPrizePoolTokenId(0),
            fetchNftPrizePoolTokenIdSecond(0),
            fetchNftPrizePoolTokenIdThird(0),

            
          ]);
    
          // Wait 2 seconds before fetching the next group
          await new Promise((resolve) => setTimeout(resolve, 1100));
        // Group 2 

  
        await Promise.all([
          fetchNFTFirstDepositor(),

          fetchNFTFirstDepositorThird(),
 
        ]);
  
        // Wait 2 seconds before fetching the last group
        await new Promise((resolve) => setTimeout(resolve, 1100));

        await Promise.all([

          fetchNFTFirstDepositorSecond(),

 
        ]);

        await new Promise((resolve) => setTimeout(resolve, 1500));
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

        const addresses = response[0]; 
        const scores = response[1]; 

        setLeaderboardAddresses(addresses);
        setLeaderboardScores(scores);

      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Group 1
      
      if (address) {
        await Promise.all([
          
          fetchNftPrizePoolTokenId(0),
          fetchNftPrizePoolContract(),
        
          fetchLastNFTPrizeWinner(),
        ]);
  
        // Wait 2 seconds before fetching the next group
        await new Promise((resolve) => setTimeout(resolve, 1000));
  
        // Group 2 ( first to view)
        await Promise.all([
     

         
          
        ]);
  
        // Wait 2 seconds before fetching the next group
        await new Promise((resolve) => setTimeout(resolve, 1000));
  
        // Group 3
        await Promise.all([

          fetchLastNFTLotteryWinner(),

        ]);
  
        // Wait 2 seconds before fetching the last group
        await new Promise((resolve) => setTimeout(resolve, 1000));
  
        // Group 4
        await Promise.all([

          fetchLeaderboard(),

        ]);

        await new Promise((resolve) => setTimeout(resolve, 1000));
  
        // Group 5
        await Promise.all([
          
          
          fetchNftPrizePoolTokenIdSecond(0),
          fetchNftPrizePoolTokenIdThird(0),

  
          fetchNftPrizePoolContractSecond(),
          fetchNftPrizePoolContractThird(),
    
       
 


       
        ]);
        
        await new Promise((resolve) => setTimeout(resolve, 1000));
  
        // Group 6
        await Promise.all([
          



      

         
          fetchNFTFirstDepositorSecond(),
          fetchNFTFirstDepositorThird(),

    
          fetchLastNFTPrizeWinnerSecond(),
          fetchLastNFTPrizeWinnerThird(),

   

       
        ]);
      }
    };
  
    fetchData();
  }, [lotteryContract, address]);






//FETCH LOTTERY BALACNE
const fetchLotteryBalance = async () => {
  try {
    if (lotteryContract) {
      const balanceWei = await lotteryContract.methods.getLotteryBalance().call();
      const balanceEth = web3.utils.fromWei(balanceWei, 'ether');  // Convert wei to ETH
      setLotteryPot(balanceEth);  // Store the converted balance in state
    }
  } catch (error) {
    console.error("Error fetching lottery balance:", error);
  }
};
//LOTTERY WINNER with BERA
const fetchLastWinner = async () => {
  try {
    if (lotteryContract) {
      const result = await lotteryContract.methods.lastWinner().call();
      setLastWinner({
        winnerAddress: result.winnerAddress,
        amountWon: result.amountWon
      });
    }
  } catch (error) {
    console.error("Error fetching last winner:", error);
  }
};
const fetchNftLastWinner = async () => {
  try {
    if (lotteryContract) {
      const winnerAddress = await lotteryContract.methods.lastNFTLotteryWinner().call();
      setLastWinner(winnerAddress); // Directly set the winner address
    }
  } catch (error) {
    console.error("Error fetching last NFT lottery winner:", error);
  }
};

  const fetchAllNftPrizeRounds = async () => {
    try {
      if (!lotteryContract) {
        console.error("Lottery contract is not initialized!");
        return;
      }
  
      // Call the contract's function with startIndex = 0 and limit = 15
      const startIndex = 0;
      const limit = 100;
  
      // Calling the contract method
      const result = await lotteryContract.methods.getNFTPrizeRounds(startIndex, limit).call();
  
      // result is expected to be an array of two address[] arrays
      const addresses1 = result[0];
      const addresses2 = result[1];
  

  
      // Store the result in the state as an object containing the two address arrays
      setNftPrizeRounds({ addresses1, addresses2 });
  
    } catch (error) {
      console.error("Error fetching NFT Prize Third Rounds: ", error);
    }
  };

  

  const fetchAllNftPrizeSecondRounds = async () => {
    try {
      if (!lotteryContract) {
        console.error("Lottery contract is not initialized!");
        return;
      }
  
      // Call the contract's function with startIndex = 0 and limit = 15
      const startIndex = 0;
      const limit = 100;
  
      // Calling the contract method
      const result = await lotteryContract.methods.getNFTPrizeSecondRounds(startIndex, limit).call();
  
      // result is expected to be an array of two address[] arrays
      const addresses1 = result[0];
      const addresses2 = result[1];
  

  
      // Store the result in the state as an object containing the two address arrays
      setNftPrizeSecondRounds({ addresses1, addresses2 });
  
    } catch (error) {
      console.error("Error fetching NFT Prize Third Rounds: ", error);
    }
  };
  
  const fetchNFTPrizeThirdRounds = async () => {
    try {
      if (!lotteryContract) {
        console.error("Lottery contract is not initialized!");
        return;
      }
  
      // Call the contract's function with startIndex = 0 and limit = 15
      const startIndex = 0;
      const limit = 100;
  
      // Calling the contract method
      const result = await lotteryContract.methods.getNFTPrizeThirdRounds(startIndex, limit).call();
  
      // result is expected to be an array of two address[] arrays
      const addresses1 = result[0];
      const addresses2 = result[1];
  

  
      // Store the result in the state as an object containing the two address arrays
      setNftPrizeThirdRounds({ addresses1, addresses2 });
  
    } catch (error) {
      console.error("Error fetching NFT Prize Third Rounds: ", error);
    }
  };
  

  const fetchLotteryPlayers = async () => {
    if (lotteryContract) {
      try {
        const players = await lotteryContract.methods.getLotteryPlayers().call();
        // Filter out the invalid addresses (e.g., 0x000000... addresses)
        const validPlayers = players.filter(player => player !== '0x0000000000000000000000000000000000000000');
        setLotteryPlayers(validPlayers); // Update state with the valid players
      } catch (error) {
        console.error('Error fetching lottery players:', error);
      }
    }
  };
  
  const fetchNftLotteryPlayers = async () => {
    if (lotteryContract) {
      try {
        const players = await lotteryContract.methods.getNftLotteryPlayers().call();
        // Filter out the invalid addresses (0x000... addresses)
        const validPlayers = players.filter(player => player !== '0x0000000000000000000000000000000000000000');
        setNftLotteryPlayers(validPlayers); // Update state with the valid players
      } catch (error) {
        console.error('Error fetching NFT lottery players:', error);
      }
    }
  };


  const fetchLastNFTLotteryWinner = async () => {
    if (lotteryContract) {
      try {

        const winner = await lotteryContract.methods.lastNFTLotteryWinner().call();

        setLastNFTLotteryWinner(winner);
      } catch (error) {
        console.error('Error fetching last NFT lottery winner:', error);
      }
    }
  };


  const fetchNFTTokenId = async () => {
    if (lotteryContract && address) {
      try {

        const tokenId = await lotteryContract.methods.nftTokenId().call({ from: address });

        setNftTokenId(tokenId); 
      } catch (error) {

      }
    }
  };

  const fetchNftPrizePoolTokenId = async (index) => {

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

        const contractAddress = await lotteryContract.methods.nftPrizePoolContract().call();

        setNftPrizePoolContract(contractAddress); 
      } catch (error) {
      }
    }
  };
  const fetchNftPrizePoolContractSecond = async () => {
    if (lotteryContract) {
      try {

        const contractAddress = await lotteryContract.methods.nftPrizePoolContractSecond().call();

        setNftPrizePoolContractSecond(contractAddress); 
      } catch (error) {
      
      }
    }
  };
  
  const fetchNftPrizePoolContractThird = async () => {
    if (lotteryContract) {
      try {

        const contractAddress = await lotteryContract.methods.nftPrizePoolContractThird().call();

        setNftPrizePoolContractThird(contractAddress); 
      } catch (error) {
    
      }
    }
  };
  const fetchNFTFirstDepositor = async () => {
    if (lotteryContract) {
      try {

        const depositor = await lotteryContract.methods.NFTFirstDepositor().call();

        setNftFirstDepositor(depositor); 
      } catch (error) {
 
      }
    }
  };
  const fetchNFTFirstDepositorSecond = async () => {
    if (lotteryContract) {
      try {

        const depositor = await lotteryContract.methods.NFTFirstDepositorSecond().call();

        setNftFirstDepositorSecond(depositor);
      } catch (error) {
 
      }
    }
  };

  const fetchNFTFirstDepositorThird = async () => {
    if (lotteryContract) {
      try {

        const depositor = await lotteryContract.methods.NFTFirstDepositorThird().call();

        setNftFirstDepositorThird(depositor);
      } catch (error) {

      }
    }
  };

  const fetchLastNFTPrizeWinner = async () => {
    if (lotteryContract) {
      try {

        const winner = await lotteryContract.methods.lastNFTPrizeWinner().call();
 
        setLastNFTPrizeWinner(winner); 
      } catch (error) {

      }
    }
  };
  const fetchLastNFTPrizeWinnerSecond = async () => {
    if (lotteryContract) {
      try {

        const winner = await lotteryContract.methods.lastNFTPrizeWinnerSecond().call();

        setLastNFTPrizeWinnerSecond(winner);
      } catch (error) {

      }
    }
  };

  const fetchLastNFTPrizeWinnerThird = async () => {
    if (lotteryContract) {
      try {

        const winner = await lotteryContract.methods.lastNFTPrizeWinnerThird().call();

        setLastNFTPrizeWinnerThird(winner);
      } catch (error) {

      }
    }
  };
  const depositNFTToPrizePool = async (nftContractAddress, nftTokenId) => {
    if (lotteryContract) {
      try {
        console.log('Depositing NFT to nft duel');
        
        // Get the entry fee from the contract
        const entryFee = await lotteryContract.methods.entryFee().call();
        
        // Estimate gas for the transaction
        const estimatedGas = await lotteryContract.methods.depositNFTToPrizePool(nftContractAddress, nftTokenId).estimateGas({
          from: address,
          value: entryFee, // Use the entry fee retrieved from the contract
        });
  
        // Get the current gas price
        const gasPrice = await web3.eth.getGasPrice();
  
        // Send the transaction with the entry fee
        await lotteryContract.methods.depositNFTToPrizePool(nftContractAddress, nftTokenId).send({
          from: address,
          gas: estimatedGas,
          value: entryFee, // Send the entry fee amount
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
        console.log('Depositing NFT to nft duel');
        
        const entryFee = await lotteryContract.methods.entryFee().call();

        const estimatedGas = await lotteryContract.methods.depositNFTToPrizePoolSecond(nftContractAddress, nftTokenId).estimateGas({
          from: address,
          value: entryFee, // Send 1 ether
        });
  
        const gasPrice = await web3.eth.getGasPrice();
  
        await lotteryContract.methods.depositNFTToPrizePoolSecond(nftContractAddress, nftTokenId).send({
          from: address,
          gas: estimatedGas,
          value: entryFee, // Send the entry fee amount
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
        console.log('Depositing NFT to nft duel');
          
        const entryFee = await lotteryContract.methods.entryFee().call();

        const estimatedGas = await lotteryContract.methods.depositNFTToPrizePoolThird(nftContractAddress, nftTokenId).estimateGas({
          from: address,
          value: entryFee, // Send 1 ether
        });
  
 
        const gasPrice = await web3.eth.getGasPrice();

  

        await lotteryContract.methods.depositNFTToPrizePoolThird(nftContractAddress, nftTokenId).send({
          from: address,
          value: entryFee, // Send the entry fee amount
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
  
  // REV SHARE

   const fetchSharepoolBalance = async () => {
    try {
      if (lotteryContract) {
        const balanceWei = await lotteryContract.methods.sharepool().call();
        const balanceEth = web3.utils.fromWei(balanceWei, 'ether');  // Convert wei to ETH
        setSharepoolBalance(balanceEth);  // Store the converted balance in state
      }
    } catch (error) {
      console.error("Error fetching sharepool balance:", error);
    }
  };
  const BurnNFT = async (nftTokenId) => {
    if (lotteryContract) {
      try {
        console.log('Depositing NFT to nft duel');
    
        const estimatedGas = await lotteryContract.methods.BurnNFT(nftTokenId).estimateGas({
          from: address,
          value: web3.utils.toWei('0', 'ether'), // Send 0 ether
        });
    
        const gasPrice = await web3.eth.getGasPrice();
    
        console.log('Estimated gas:', estimatedGas);
    
        await lotteryContract.methods.BurnNFT(nftTokenId).send({
          from: address,
          value: web3.utils.toWei('0', 'ether'), // Send 0 ether
          gas: estimatedGas,
          gasPrice,
        });
    
        console.log('Burning NFT');
        refreshDataWithInterval(); // If needed, refresh data after successful deposit
      } catch (err) {
        console.error('Error depositing NFT:', err);
        alert('Transaction failed: ' + err.message);
      }
    }
  };
  

  const fetchUserList = async () => {
    try {
      const users = await lotteryContract.methods.getuserList().call();
      const addresses = users[0]; // Wallet addresses array
      const values = users[1]; // Corresponding values array

      setUserAddresses(addresses);
      setUserValues(values);
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  };
  useEffect(() => {
    if (lotteryContract) {
      fetchUserList();
      fetchUserListCount();
    }
  }, [lotteryContract]);

  const fetchUserListCount = async () => {
    if (lotteryContract) {
      try {
        const count = await lotteryContract.methods.getUserlistCount().call();
        setUserlistCount(count);
      } catch (error) {
        console.error('Error fetching user list count:', error);
      }
    }
  };
    // REV SHARE
  
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
  
        const estimatedGas = await lotteryContract.methods.withdrawNFTFromPrizePoolSecond(index).estimateGas({
          from: address,
        });
  

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

        const estimatedGas = await lotteryContract.methods.withdrawNFTFromPrizePoolThird(index).estimateGas({
          from: address,
        });
  

        await lotteryContract.methods.withdrawNFTFromPrizePoolThird(index).send({
          from: address,
          gas: estimatedGas,
          gasPrice: null, 
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
  

      const estimatedGas = await lotteryContract.methods.enter().estimateGas({
        from: address,
        value: '250000000000000000',
      });

      await lotteryContract.methods.enter().send({
        from: address,
        value: '250000000000000000',
        gas: estimatedGas,
        gasPrice: null, 
      });
  
      await fetchLotteryBalance();
      refreshDataWithInterval(); 
    } catch (err) {
      console.error('Error entering lottery:', err);
    }
  };

  const enterNFT = async () => {
    try {
      console.log('Entering NFT lottery');
  

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
        //tab refresh data

        refreshData,

        //revshre
        fetchUserList,
        userAddresses, 
        userValues,
        userlistCount,
        fetchUserListCount,
        fetchSharepoolBalance, 
        sharepoolBalance, 
   //REV SHARE
   BurnNFT,

        fetchLotteryBalance,
        LotteryBalance: lotteryPot,
        lotteryPot, // Expose the lottery pot balance
        fetchLastWinner, //fOR LOTTERY prev winner

        fetchNftLastWinner,
        fetchNFTTokenId,
        setNftTokenId,

        address,
        connectWallet,
        lotteryPot,


        lotteryPlayers, // Add lotteryPlayers here
        fetchLotteryPlayers, // If you want to expose the fetch function
        nftLotteryPlayers, // New NFT lottery players
        fetchNftLotteryPlayers,
        
        enterLottery,
        enterNFT,

        // New leaderboard data
        leaderboardAddresses,
        leaderboardScores,
        //lastwinners
        lastWinner,

        lastNFTLotteryWinner,
        lastNFTPrizeWinner, 
        lastNFTPrizeWinnerSecond, // New state
        lastNFTPrizeWinnerThird, // New state

        etherscanUrl,
        nftTokenId, 

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
        fetchNFTPrizeThirdRounds, // Expose the function
        nftPrizeThirdRounds, // Expose the state variable

        nftPrizeRounds, // Expose the nftPrizeRounds data
        fetchAllNftPrizeRounds, // Expose the fetch function
        nftPrizeSecondRounds, // Expose the nftPrizeSecondRounds data
        fetchAllNftPrizeSecondRounds, // Expose the fetch function for second rounds

      }}
    >
      {children}
    </appContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(appContext);
};
