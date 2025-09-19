'use client';

import { Trash2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import type { CollaboratorSplit } from '../lib/types';

interface CollaboratorListItemProps {
  collaborator: Omit<CollaboratorSplit, 'splitId' | 'groupId'>;
  index: number;
  onUpdate: (index: number, field: keyof Omit<CollaboratorSplit, 'splitId' | 'groupId'>, value: string | number) => void;
  errors: Record<string, string>;
  canRemove: boolean;
  onRemove: () => void;
}

export function CollaboratorListItem({
  collaborator,
  index,
  onUpdate,
  errors,
  canRemove,
  onRemove,
}: CollaboratorListItemProps) {
  return (
    <div className="bg-dark-bg rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-white">Collaborator {index + 1}</h4>
        {canRemove && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRemove}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Display Name
          </label>
          <Input
            value={collaborator.displayName}
            onChange={(e) => onUpdate(index, 'displayName', e.target.value)}
            placeholder="Enter display name"
            error={errors[`displayName-${index}`]}
            size="sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Wallet Address
          </label>
          <Input
            value={collaborator.collaboratorWalletAddress}
            onChange={(e) => onUpdate(index, 'collaboratorWalletAddress', e.target.value)}
            placeholder="0x..."
            error={errors[`collaboratorWalletAddress-${index}`]}
            size="sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Percentage (%)
          </label>
          <Input
            type="number"
            value={collaborator.percentage}
            onChange={(e) => onUpdate(index, 'percentage', parseFloat(e.target.value) || 0)}
            placeholder="50"
            min="0"
            max="100"
            step="0.1"
            error={errors[`percentage-${index}`]}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
