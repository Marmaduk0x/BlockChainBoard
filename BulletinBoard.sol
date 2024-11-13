pragma solidity ^0.8.0;

contract BulletinBoard {
    
    event MessagePosted(address indexed sender, string message, uint256 timestamp);
    
    event MessageFlagged(uint256 indexed messageId, address indexed flagger, string reason);
    
    struct BoardMessage {
        address sender;
        string content;
        uint256 postedAt;
        bool isFlagged;
        string flagReason;
    }
    
    BoardMessage[] private boardMessages;

    function postMessage(string memory messageContent) public {
        require(bytes(messageContent).length > 0, "Message cannot be empty");

        boardMessages.push(BoardMessage(msg.sender, messageContent, block.timestamp, false, ""));
        
        emit MessagePosted(msg.sender, messageContent, block.timestamp);
    }
    
    function fetchAllMessages() public view returns (BoardMessage[] memory) {
        require(boardMessages.length > 0, "No messages posted yet");

        return boardMessages;
    }
    
    function flagMessage(uint256 messageId, string memory flagReason) public {
        require(messageId < boardMessages.length, "Invalid message ID");
        require(bytes(flagReason).length > 0, "Reason for flagging cannot be empty");
        
        BoardMessage storage messageToFlag = boardMessages[messageId];
        require(!messageToFlag.isFlagged, "Message already flagged");

        messageToFlag.isFlagged = true;
        messageToFlag.flagReason = flagReason;
        
        emit MessageFlagged(messageId, msg.sender, flagReason);
    }
    
    function fetchUnflaggedMessages() public view returns (BoardMessage[] memory) {
        uint256 unflaggedCount = 0;
        for (uint256 i = 0; i < boardMessages.length; i++) {
            if (!boardMessages[i].isFlagged) {
                unflaggedCount++;
            }
        }
        
        BoardMessage[] memory unflaggedMessages = new BoardMessage[](unflaggedCount);
        uint256 j = 0;
        for (uint256 i = 0; i < boardMessages.length; i++) {
            if (!boardMessages[i].isFlagged) {
                unflaggedMessages[j] = boardMessages[i];
                j++;
            }
        }
        
        return unflaggedMessages;
    }
}