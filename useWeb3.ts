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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    const loadWeb3 = async () => {
      try {
        setLoading(true);
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3 = new Web3(window.ethereum);
          const accounts = await web3.eth.getAccounts();

          const contract = new web3.eth.Contract(BulletinBoardABI, CONTRACT_ADDRESS);

          setWeb3State({ web3, accounts, contract });
        } else {
          console.error('Install MetaMask.');
          setError(new Error('Web3 provider not found. Please install MetaMask.'));
        }
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };
    
    loadWeb3();
  }, []);

  return { ...web3State, loading, error };
};