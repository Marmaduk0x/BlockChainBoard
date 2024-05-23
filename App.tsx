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
  const [error, setError] = useState<string>(""); // Error state

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        console.log("Please ensure you have MetaMask installed!");
        setError("MetaMask not detected."); // Setting error
        return;
      } else {
        console.log("Ethereum object detected: ", ethereum);
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length !== 0) {
          const primaryAccount = accounts[0];
          setUserWalletAddress(primaryAccount);
        } else {
          console.log("No authorized account found");
          setError("No authorized account found."); // Setting error
        }
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      setError('Wallet connection error.'); // Setting error
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
      setError('Error connecting wallet.'); // Setting error
    }
  };

  const handleMessageSubmission = async () => {
    // Assuming message submission might involve interacting with the Ethereum network or a backend
    try {
      console.log("Message submitted: ", newMessage);
      // Simulate message submission operation, including possible failure
      // Example: await submitMessageToBlockchain(newMessage);

      setNewMessage('');
    } catch (error) {
      console.error('Error submitting message:', error);
      setError('Error submitting message.'); // Setting error
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {error && <p className="Error">{error}</p>} {/* Displaying errors */}
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