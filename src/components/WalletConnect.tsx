import React, { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { Wallet } from 'lucide-react';

const WalletConnect = () => {
  const [account, setAccount] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this feature');
      return;
    }

    try {
      setIsConnecting(true);
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const account = accounts[0];
      setAccount(account);

      const balance = await provider.getBalance(account);
      const formattedBalance = (+balance.toString() / 1e18).toFixed(4);
      setBalance(formattedBalance);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {!account ? (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          <Wallet className="w-5 h-5" />
          <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
        </button>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Wallet Connected</h2>
          <div className="space-y-2">
            <p className="text-gray-600">
              Account:{' '}
              <span className="font-mono text-sm">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            </p>
            <p className="text-gray-600">
              Balance: <span className="font-semibold">{balance} ETH</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;