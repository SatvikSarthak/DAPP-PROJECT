import React from 'react';
import { MessageCircle } from 'lucide-react';
import { AptosWalletProvider } from './components/AptosWalletProvider';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import useAptosMessaging from './hooks/useAptosMessaging';

function MessagingApp() {
  const { account, connect, disconnect } = useWallet();
  const { messages, sendMessage, isLoading, isConnected } = useAptosMessaging();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-8 h-8 text-white" />
                <h1 className="text-2xl font-bold text-white">Aptos Messenger</h1>
              </div>
              <button
                onClick={account ? disconnect : connect}
                className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                {account ? 'Disconnect' : 'Connect Wallet'}
              </button>
            </div>
            {account && (
              <p className="mt-2 text-indigo-200 font-mono">
                Connected: {account.address.slice(0, 6)}...{account.address.slice(-4)}
              </p>
            )}
          </div>

          {/* Messages Container */}
          <div className="h-[600px] flex flex-col">
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">Loading messages...</p>
              </div>
            ) : (
              <MessageList messages={messages} />
            )}
            <MessageInput onSendMessage={sendMessage} isConnected={isConnected} />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AptosWalletProvider>
      <MessagingApp />
    </AptosWalletProvider>
  );
}

export default App;