import React, { useState, useEffect } from 'react';
import './App.css';

interface IMessage {
  sender: string;
  content: string;
  timestamp: number;
}

const BlockchainMessageBoard: React.FC = () => {
  const [userWalletAddress, setUserWalletAddress] = useState<string>("");
  const [newMessage, setNewMessage] = useState<string>("");
  const [messageBoard, setMessageBoard] = useState<IMessage[]>([]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        console.log("Please ensure you have MetaMask installed!");
        return;
      } else {
        console.log("Ethereum object detected: ", ethereum);
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length !== 0) {
          const primaryAccount = accounts[0];
          setUserWalletAddress(primaryAccount);
        } else {
          console.log("No authorized account found");
        }
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
    }
  };

  const handleWalletConnection = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        alert("MetaMask is required for this application. Please install it.");
        return;
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Wallet connected:", accounts[0]);
      setUserWalletAddress(accounts[0]);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const handleMessageSubmission = async () => {
    console.log("Message submitted: ", newMessage);
    setNewMessage('');
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {userWalletAddress ? (
          <div>
            <h1>Blockchain Message Board</h1>
            <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)}></textarea>
            <button onClick={handleMessageSubmission}>Submit Message</button>
            <h2>Message Board</h2>
            <div>
              {messageBoard.map((msg, index) => (
                <div key={index}>
                  <p><strong>Sender:</strong> {msg.sender}</p>
                  <p><strong>Message:</strong> {msg.content}</p>
                  <p><strong>Timestamp:</strong> {new Date(msg.timestamp * 1000).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <button onClick={handleWalletConnection}>Connect Wallet</button>
        )}
      </header>
    </div>
  );
};

export default BlockchainMessageBoard;