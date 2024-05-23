import React, { useEffect, useState } from 'react';
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
  const [blockchainWeb3Instance, setBlockchainWeb3Instance] = useState<Web3 | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      setBlockchainWeb3Instance(web3);
    } else {
      console.error("Ethereum object not found. Please install MetaMask to interact with the blockchain.");
    }
  }, []);

  useEffect(() => {
    const loadMessagesFromBlockchain = async () => {
      if (blockchainWeb3Instance && blockchainContractAddress) {
        const contract = new blockchainWeb3Instance.eth.Contract(contractABI, blockchainContractAddress);
        const blockchainMessages = await contract.methods.getMessages().call();

        const formattedMessages = blockchainMessages.map((message: any) => ({
          content: message.content,
          sender: message.sender,
          timestamp: new Date(parseInt(message.timestamp) * 1000).toLocaleString(),
        }));
        
        setBoardMessages(formattedMessages);
      }
    };
    
    loadMessagesFromBlockchain().catch(console.error);
  }, [blockchainWeb3Instance]);

  return (
    <div>
      {boardMessages.map((message, index) => (
        <div key={index}>
          <p>Content: {message.content}</p>
          <p>Sender: {message.sender}</p>
          <p>Timestamp: {message.timestamp}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageBoard;