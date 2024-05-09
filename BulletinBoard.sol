pragma solidity ^0.8.0;

contract BulletinBoard {
    
    event MessagePosted(address indexed sender, string message, uint256 timestamp);
    
    struct Message {
        address sender;
        string message;
        uint256 timestamp;
    }
    
    Message[] private messages;
    
    function postMessage(string memory _message) public {
        messages.push(Message(msg.sender, _message, block.timestamp));
        
        emit MessagePosted(msg.sender, _message, block.timestamp);
    }
    
    function getAllMessages() public view returns (Message[] memory) {
        return messages;
    }
}