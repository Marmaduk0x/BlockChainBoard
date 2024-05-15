pragma solidity ^0.8.0;

contract BulletinBoard {
    
    event MessagePosted(address indexed sender, string message, uint256 timestamp);
    event MessageFlagged(uint256 indexed messageId, address indexed flagger, string reason);
    
    struct Message {
        address sender;
        string message;
        uint256 timestamp;
        bool flagged;
        string flagReason;
    }
    
    Message[] private messages;
    
    function postMessage(string memory _message) public {
        require(bytes(_message).length > 0, "Message cannot be empty");

        messages.push(Message(msg.sender, _message, block.timestamp, false, ""));
        
        emit MessagePosted(msg.sender, _message, block.timestamp);
    }
    
    function getAllMessages() public view returns (Message[] memory) {
        require(messages.length > 0, "No messages posted yet");

        return messages;
    }
    
    function flagMessage(uint256 _messageId, string memory _reason) public {
        require(_messageId < messages.length, "Invalid message ID");
        require(bytes(_reason).length > 0, "Reason for flagging cannot be empty");
        
        Message storage messageToFlag = messages[_messageId];
        require(!messageToFlag.flagged, "Message already flagged");

        messageToFlag.flagged = true;
        messageToFlag.flagReason = _reason;
        
        emit MessageFlagged(_messageId, msg.sender, _reason);
    }
    
    function getUnflaggedMessages() public view returns (Message[] memory) {
        uint256 unflaggedCount = 0;
        for(uint256 i = 0; i < messages.length; i++) {
            if(!messages[i].flagged) {
                unflaggedCount++;
            }
        }
        
        Message[] memory unflaggedMessages = new Message[](unflaggedCount);
        uint256 j = 0;
        for(uint256 i = 0; i < messages.length; i++) {
            if(!messages[i].flagged) {
                unflaggedMessages[j] = messages[i];
                j++;
            }
        }
        
        return unflaggedMessages;
    }
}