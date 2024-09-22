import React, { createContext, useContext, useState } from 'react';

const NftContext = createContext();

export const NftProvider = ({ children }) => {
  const [nftTokenId, setNftTokenId] = useState('');

  return (
    <NftContext.Provider value={{ nftTokenId, setNftTokenId }}>
      {children}
    </NftContext.Provider>
  );
};

export const useNftContext = () => useContext(NftContext);
