import { useState, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

const MODULE_ADDRESS = '0x1'; // Replace with your deployed module address
const MODULE_NAME = 'messaging';
const FUNCTION_NAME = 'send_message';

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

export const useAptosMessaging = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const aptosConfig = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(aptosConfig);

  const fetchMessages = async () => {
    try {
      const resources = await aptos.getAccountResources({ accountAddress: MODULE_ADDRESS });
      const messageResource = resources.find(
        (r) => r.type === `${MODULE_ADDRESS}::${MODULE_NAME}::MessageStore`
      );
      
      if (messageResource) {
        setMessages(messageResource.data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!account?.address) throw new Error('Wallet not connected');

    try {
      const payload = {
        function: `${MODULE_ADDRESS}::${MODULE_NAME}::${FUNCTION_NAME}`,
        type_arguments: [],
        arguments: [content]
      };

      const response = await signAndSubmitTransaction({ payload });
      await aptos.waitForTransaction({ transactionHash: response.hash });
      await fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000); // Poll for new messages
    return () => clearInterval(interval);
  }, [account?.address]);

  return {
    messages,
    sendMessage,
    isLoading,
    isConnected: !!account?.address
  };
};

export default useAptosMessaging;