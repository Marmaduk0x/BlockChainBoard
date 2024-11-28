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
  const [account, setAccount] = useState('');
  const blockchainWeb3Instance = useRef<Web3 | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      blockchainWeb3Instance.current = new Web3(window.ethereum);
      checkAccountConnected();
    } else {
      console.error("Ethereum object not found. Please install MetaMask to interact with the blockchain.");
    }

    function handleNetworkChange() {
      window.location.reload();
    }

    window.ethereum?.on('accountsChanged', checkAccountConnected);
    window.ethereum?.on('chainChanged', handleNetworkChange);
    
    return () => {
      window.ethereum?.removeListener('accountsChanged', checkAccountConnected);
      window.ethereum?.removeListener('chainChanged', handleNetworkChange);
    };
  }, []);

  const contractInstance = useMemo(() => {
    if (!blockchainWeb3Instance.current || !blockchainContractAddress) {
      return null;
    }
    return new blockchainWeb3Instance.current.eth.Contract(contractABI, blockchainContractAddress);
  }, [blockchainContractAddress]);

  const checkAccountConnected = useCallback(async () => {
    const accounts = await blockchainWeb3Instance.current?.eth.getAccounts();
    if (accounts && accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      alert('Please connect to MetaMask.');
    }
  }, []);

  const connectWallet = useCallback(async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
  }, []);

  const sendMessageToBlockchain = async (content: string) => {
    if (!contractInstance || !account) return;
    try {
      await contractInstance.methods.postMessage(content).send({ from: account });
      await loadMessagesFromBlockchain();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = formData.get('message') as string;
    await sendMessageToBlockchain(message);
    event.currentTarget.reset();
  };

  if (!account) {
    return <button onClick={connectWallet}>Connect Wallet</button>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="message" type="text" placeholder="Write your message" required />
        <button type="submit">Send Message</button>
      </form>
      <button onClick={() => loadMessagesFromBlockchain()}>Refresh Messages</button>
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