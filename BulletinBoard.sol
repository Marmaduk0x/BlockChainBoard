pragma solidity ^0.8.0;

contract BulletinBoard {
    
    event MessagePosted(address indexed sender, string message, uint256 timestamp);
    
    event MessageFlagged(uint256 indexed messageId, address indexed flagger, string reason);
    
    struct Message {
        address sender;
        string content;
        uint256 postedAt;
        bool flagged;
        string flagReason;
    }
    
    Message[] private messages;

    function postMessage(string memory content) public {
        require(bytes(content).length > 0, "Message cannot be empty");

        messages.push(Message(msg.sender, content, block.timestamp, false, ""));
        
        emit MessagePosted(msg.sender, content, block.timestamp);
    }
    
    function getAllMessages() public view returns (Message[] memory) {
        require(messages.length > 0, "No messages posted yet");

        return messages;
    }
    
    function flagMessage(uint256 messageId, string memory reason) public {
        require(messageId < messages.length, "Invalid message ID");
        require(bytes(reason).length > 0, "Flagging reason cannot be empty");
        
        Message storage messageToFlag = messages[messageId];
        require(!messageToFlag.flagged, "Message already flagged");

        messageToFlag.flagged = true;
        messageToFlag.flagReason = reason;
        
        emit MessageFlagged(messageId, msg.sender, reason);
    }
    
    function getUnflaggedMessages() public view returns (Message[] memory) {
        uint256 unflaggedCount = 0;
        for (uint256 i = 0; i < messages.length; i++) {
            if (!messages[i].flagged) {
                unflaggedCount++;
            }
        }
        
        Message[] memory unflaggedMessages = new Message[](unflaggedCount);
        uint256 index = 0;
        for (uint256 i = 0; i < messages.length; i++) {
            if (!messages[i].flagged) {
                unflaggedMessages[index] = messages[i];
                index++;
            }
        }
        
        return unflaggedMessages;
    }
}