import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { ethers } from "ethers";
import './App.css';

interface IMessage {
  sender: string;
  content: string;
  timestamp: number;
}

const BlockChainBoard: React.FC = () => {
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>([]);

  const checkWalletIsConnected = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        console.log("Ensure you have MetaMask installed!");
        return;
      } else {
        console.log("Ethereum object detected: ", ethereum);
        const accounts = await ethereum.request({method: 'eth_accounts'});
        if (accounts.length !== 0) {
          const account = accounts[0];
          setCurrentAccount(account);
        } else {
          console.log("No authorized account found");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWalletHandler = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        alert("Download MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const submitMessageHandler = async () => {
    console.log("Submitting message: ", message);
    setMessage('');
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {currentAccount ? (
          <div>
            <h1>BlockChain Message Board</h1>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
            <button onClick={submitMessageHandler}>Submit Message</button>
            <h2>Messages</h2>
            <div>
              {messages.map((msg, index) => (
                <div key={index}>
                  <p><strong>Sender:</strong> {msg.sender}</p>
                  <p><strong>Message:</strong> {msg.content}</p>
                  <p><strong>At:</strong> {new Date(msg.timestamp * 1000).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <button onClick={connectWalletHandler}>Connect Wallet</button>
        )}
      </header>
    </div>
  );
};

export default BlockChainBoard;