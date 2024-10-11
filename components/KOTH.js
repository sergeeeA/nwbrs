import React, { useState, useEffect, useRef } from 'react';
import style from '../styles/koth.module.css';
import { useAppContext } from '../context/context';
import { useNftContext } from '../context/NftContext';
import nftAbi from '../utils/nft';
import Web3 from 'web3';

const NFT_CONTRACT_ADDRESS = '0x4Ae3985e45784CB73e1886AC603B5FEed4F08a05';
const APPROVE_ADDRESS = '0xD40CB0bc61228053299524031217747780DB88Cd';

const NftDuel = () => {
  const { enterKOTH } = useAppContext();
  const { nftTokenId, setNftTokenId } = useNftContext();
  const [nftContract, setNftContract] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
  const backgroundRef = useRef(null);

  useEffect(() => {
    const contract = new web3.eth.Contract(nftAbi.nftAbi, NFT_CONTRACT_ADDRESS);
    setNftContract(contract);
  }, []); // Runs only once

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (backgroundRef.current) {
        const x = (event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        const y = (event.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        
        backgroundRef.current.style.backgroundPosition = `${x * -25}px, 
                                                            ${x * 12}px, 
                                                            ${x * -7}px, 
                                                            ${x * 4}px`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nftTokenId && nftContract) {
      try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
          alert('Please connect your wallet.');
          return;
        }

        setLoading(true); // Start loading
        const approveResult = await nftContract.methods.approve(APPROVE_ADDRESS, nftTokenId).send({ from: accounts[0] });
        console.log('Approval result:', approveResult);

        console.log('Approval successful. Depositing NFT...');
        console.log('Entering KOTH...');
        await enterKOTH(nftTokenId);
        console.log(`Entered KOTH with tokenId: ${nftTokenId}`);
      } catch (error) {
        console.error('Error processing transaction:', error);
        alert('An error occurred: ' + error.message);
      } finally {
        setLoading(false); // End loading
      }
    } else {
      alert('Please provide an NFT Token ID.');
    }
  };

  return (
    <div className={style.parentcontainer}>
      <div className={style.wrappernft}>
        <div className={style.background} ref={backgroundRef}>
        </div>
        
        <div className={style.parentcontainer}>
          <label className={style.title} htmlFor="nftTokenId" style={{ cursor: 'url("/curs.png"), auto' }}>
            SEND DWELLER
          </label>
          <form onSubmit={handleSubmit}>
            <div className={style.tooltip}>
              <input
                type="number"
                id="nftTokenId"
                value={nftTokenId}
                onChange={(e) => setNftTokenId(e.target.value)}
                required
                className={style.numberInput}
              />
              <div className={style.tooltiptext}>
                Click any token ID in your NFT Inventory!
              </div>
            </div>
            <div className={style.parentcontainer}>
              <button
                type="submit"
                disabled={loading} // Disable button during loading
                style={{
                  width: '50%',
                  height: '40%',
                  padding: '10px 10px',
                  backgroundColor: 'transparent',
                  color: '#C8AC53',
                  fontSize: '20px',
                  fontFamily: 'Monofonto',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                  transformOrigin: 'center',
                }}
              >
                <div className={style.btnWrapper}>
                  <div className={style.tooltipw}>
                    <div className={style.btn}>
                      {loading ? (
                        <div className={style.loadingCircle}></div> // Loading circle
                      ) : (
                        'ENTER'
                      )}
                    </div>
                    <div className={style.tooltiptextw}>
                      YOU ARE BURNING YOUR NFT!
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NftDuel;
