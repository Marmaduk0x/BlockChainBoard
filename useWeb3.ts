import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import BulletinBoardABI from './BulletinBoardABI.json';

interface Web3State {
  web3?: Web3;
  accounts?: string[];
  contract?: any;
}

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

export const useWeb3 = () => {
  const [web3State, setWeb3State] = useState<Web3State>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    initWeb3();
  }, []);

  const initWeb3 = async () => {
    try {
      checkIfMetaMaskIsAvailable();
      const web3 = initializeWeb3();
      const accounts = await web3.eth.getAccounts();
      const contract = initializeContract(web3);
      setWeb3State({ web3, accounts, contract });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfMetaMaskIsAvailable = () => {
    if (!window.ethereum) {
      const errorMessage = 'Web3 provider not found. Please install MetaMask.';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const initializeWeb3 = () => {
    return new Web3(window.ethereum);
  };

  const initializeContract = (web3: Web3) => {
    return new web3.eth.Contract(BulletinBoardABI, CONTRACT_ADDRESS);
  };

  const handleError = (error: any) => {
    console.error("An error occurred: ", error.message);
    setError(new Error("Failed to load Web3, accounts, or contract. Check console for details."));
  };

  return { ...web3State, loading, error };
};