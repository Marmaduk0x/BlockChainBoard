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
  const blockchainWeb3Instance = useRef<Web2 | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      blockchainWeb3Instance.current = web3;
    } else {
      console.error("Ethereum object not found. Please install MetaMask to interact with the blockchain.");
    }
  }, []);

  const loadMessagesFromBlockchain = useCallback(async () => {
    if (blockchainWeb3Instance.current && blockchainContractAddress) {
      const contract = new blockchainWeb3Instance.current.eth.Contract(contractABI, blockchainContractAddress);
      const blockchainMessages = await contract.methods.getMessages().call();

      const formattedMessages = blockchainMessages.map((message: any) => ({
        content: message.content,
        sender: message.sender,
        timestamp: new Date(parseInt(message.timestamp) * 1000).toLocaleString(),
      }));

      setBoardMessages(formattedMessages);
    }
  }, [blockchainContractAddress]);

  useEffect(() => {
    loadMessagesFromBlockchain().catch(console.error);
    // Assuming contractAddress is the main dependency to re-fetch messages. Adjust accordingly if there are more triggers.
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