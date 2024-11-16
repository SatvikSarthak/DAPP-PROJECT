import React from 'react';
import { MessageSquare } from 'lucide-react';

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-start space-x-3">
            <MessageSquare className="w-5 h-5 text-indigo-600 mt-1" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-gray-600">
                  {message.sender.slice(0, 6)}...{message.sender.slice(-4)}
                </span>
                <span className="text-xs text-gray-500">{message.timestamp}</span>
              </div>
              <p className="mt-2 text-gray-800">{message.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;