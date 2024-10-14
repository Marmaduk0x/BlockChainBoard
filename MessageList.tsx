import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
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

  useEffect(() => {
    if (window.ethereum && !blockchainWeb3Instance.current) {
      blockchainWeb3Instance.current = new Web3(window.ethereum);
    } else if (!window.ethereum) {
      console.error("Ethereum object not found. Please install MetaMask to interact with the blockchain.");
    }
  }, []);

  const contractInstance = useMemo(() => {
    if (!blockchainWeb3Instance.current || !blockchainContractAddress) {
      return null;
    }
    return new blockchainWeb3Instance.current.eth.Contract(contractABI, blockchainContractAddress);
  }, [blockchainContractAddress]);

  // Basic caching mechanism
  const messagesCache = useRef<Map<string, BlockchainMessage[]>>(new Map());

  const loadMessagesFromBlockchain = useCallback(async () => {
    if (!contractInstance) return;

    const cacheKey = blockchainContractAddress || "default";
    if (messagesCache.current.has(cacheKey)) {
      setBoardMessages(messagesCache.current.get(cacheKey) || []);
      return;
    }

    const blockchainMessages = await contractInstance.methods.getMessages().call();

    const formattedMessages = blockchainMessages.map((message: any) => ({
      content: message.content,
      sender: message.sender,
      timestamp: new Date(parseInt(message.timestamp, 10) * 1000).toLocaleString(),
    }));

    messagesCache.current.set(cacheKey, formattedMessages);
    setBoardMessages(formattedMessages);
  }, [contractInstance, blockchainContractAddress]);

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