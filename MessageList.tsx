import React, { useEffect, useState, useCallback, useRef } from 'react';
import Web3 from 'web3';
import contractABI from './contractABI.json';

const blockchainContractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

interface BlockchainMessage {
  content: string;
  sender: string;
  timestamp: string;
}

const MessageBoard: React.FC = () => {
  const [boardMessages, setBoardMessages] = useState<BlockchainMessage[]>([]);
  const blockchainWeb3Instance = useRef<Web3 | null>(null);

  // This effect initializes Web3 instance
  useEffect(() => {
    if (window.ethereum) {
      blockchainWeb3Instance.current = new Web3(window.ethereum);
    } else {
      console.error("Ethereum object not found. Please install MetaMask to interact with the blockchain.");
    }
  }, []);

  // Function to load messages
  const loadMessagesFromBlockchain = useCallback(async () => {
    if (!blockchainWeb3Instance.current || !blockchainContractAddress) return;

    const contract = new blockchainWeb3Instance.current.eth.Contract(contractABI, blockchainContractAddress);
    const blockchainMessages = await contract.methods.getMessages().call();

    const formattedMessages = blockchainMessages.map((message: any) => ({
      content: message.content,
      sender: message.sender,
      timestamp: new Date(parseInt(message.timestamp, 10) * 1000).toLocaleString(),
    }));

    setBoardMessages(formattedMessages);
  }, [blockchainContractAddress]);

  // Effect to load messages from blockchain
  useEffect(() => {
    loadMessagesFromBlockchain().catch(console.error);
  }, [loadMessagesFromBlockchain]);

  return (
    <div>
      {boardMessages.map((message, index) => (
        <div key={`message-${index}`}>
          <p>Content: {message.content}</p>
          <p>Sender: {message.sender}</p>
          <p>Timestamp: {message.timestamp}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageBoard;