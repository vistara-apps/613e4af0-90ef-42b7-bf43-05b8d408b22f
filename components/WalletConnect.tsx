'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from './ui/Button';
import { Wallet, LogOut } from 'lucide-react';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-3">
        <div className="bg-dark-card rounded-lg px-3 py-2">
          <p className="text-sm text-gray-400">Connected</p>
          <p className="text-white font-medium">{formatAddress(address)}</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => disconnect()}
          className="flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Disconnect</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Wallet className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-white mb-2">Connect Wallet</h3>
        <p className="text-gray-400 text-sm">
          Connect your wallet to send and receive tips
        </p>
      </div>

      <div className="space-y-2">
        {connectors.map((connector) => (
          <Button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={!connector.available}
            className="w-full btn-primary"
          >
            Connect {connector.name}
          </Button>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
          <p className="text-red-400 text-sm">{error.message}</p>
        </div>
      )}
    </div>
  );
}