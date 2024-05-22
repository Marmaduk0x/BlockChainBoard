import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import contractABI from './contractABI.json';
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

interface IMessage {
  content: string;
  sender: string;
  timestamp: string;
}

const MessageList: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [web3, setWeb3] = useState<Web3 | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    } else {
      console.error("Ethereum object not found, you must install MetaMask!");
    }
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (web3) {
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const messages = await contract.methods.getMessages().call();

        const formattedMessages = messages.map((message: any) => ({
          content: message.content,
          sender: message.sender,
          timestamp: new Date(parseInt(message.timestamp) * 1000).toLocaleString(),
        }));
        
        setMessages(formattedMessages);
      }
    };
    
    fetchMessages().catch(console.error);
  }, [web3]);

  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>
          <p>Content: {message.content}</p>
          <p>Sender: {message.sender}</p>
          <p>Timestamp: {message.timestamp}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;