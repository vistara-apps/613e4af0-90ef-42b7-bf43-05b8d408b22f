'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Input } from './ui/Input';

import { SUPPORTED_CURRENCIES } from '../lib/constants';

type Currency = typeof SUPPORTED_CURRENCIES[number];

interface TipInputProps {
  amount: string;
  onAmountChange: (amount: string) => void;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  currencies: readonly Currency[];
}

export function TipInput({
  amount,
  onAmountChange,
  currency,
  onCurrencyChange,
  currencies,
}: TipInputProps) {
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const quickAmounts = ['0.01', '0.05', '0.1', '0.5', '1.0'];

  return (
    <div className="space-y-4">
      {/* Amount Input with Currency Selector */}
      <div className="relative">
        <Input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0"
          className="pr-20"
        />
        
        {/* Currency Selector */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <button
            type="button"
            onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
            className="flex items-center space-x-1 bg-dark-bg rounded-md px-3 py-1 text-sm font-medium text-white hover:bg-opacity-80 transition-colors"
          >
            <span>{currency.symbol}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          
          {/* Dropdown */}
          {showCurrencyDropdown && (
            <div className="absolute right-0 top-full mt-1 bg-dark-surface border border-dark-border rounded-lg shadow-lg z-10 min-w-[120px]">
              {currencies.map((curr) => (
                <button
                  key={curr.symbol}
                  onClick={() => {
                    onCurrencyChange(curr);
                    setShowCurrencyDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-white hover:bg-dark-bg transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  <div>
                    <div className="font-medium">{curr.symbol}</div>
                    <div className="text-xs text-gray-400">{curr.name}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div>
        <p className="text-sm text-gray-400 mb-2">Quick amounts:</p>
        <div className="flex flex-wrap gap-2">
          {quickAmounts.map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => onAmountChange(quickAmount)}
              className="px-3 py-1 bg-dark-surface border border-dark-border rounded-md text-sm text-white hover:bg-dark-bg transition-colors"
            >
              {quickAmount} {currency.symbol}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
