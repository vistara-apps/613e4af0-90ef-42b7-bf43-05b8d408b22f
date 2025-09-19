'use client';

import { useState } from 'react';
import { Plus, Minus, ArrowLeft, Check } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { CollaboratorListItem } from './CollaboratorListItem';
import { validatePercentages, generateId, isValidAddress } from '../lib/utils';
import { MIN_COLLABORATORS, MAX_COLLABORATORS } from '../lib/constants';
import type { AppView } from '../app/page';
import type { CollaboratorSplit } from '../lib/types';

interface CreateGroupFormProps {
  onViewChange: (view: AppView, groupId?: string) => void;
}

export function CreateGroupForm({ onViewChange }: CreateGroupFormProps) {
  const [groupName, setGroupName] = useState('');
  const [collaborators, setCollaborators] = useState<Omit<CollaboratorSplit, 'splitId' | 'groupId'>[]>([
    { collaboratorWalletAddress: '', percentage: 50, displayName: '' },
    { collaboratorWalletAddress: '', percentage: 50, displayName: '' },
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addCollaborator = () => {
    if (collaborators.length < MAX_COLLABORATORS) {
      const newPercentage = Math.floor(100 / (collaborators.length + 1));
      const updatedCollaborators = collaborators.map(c => ({
        ...c,
        percentage: newPercentage,
      }));
      
      setCollaborators([
        ...updatedCollaborators,
        { collaboratorWalletAddress: '', percentage: newPercentage, displayName: '' },
      ]);
    }
  };

  const removeCollaborator = (index: number) => {
    if (collaborators.length > MIN_COLLABORATORS) {
      const newCollaborators = collaborators.filter((_, i) => i !== index);
      const equalPercentage = Math.floor(100 / newCollaborators.length);

      setCollaborators(
        newCollaborators.map(c => ({ ...c, percentage: equalPercentage }))
      );
    }
  };

  const removeLastCollaborator = () => {
    if (collaborators.length > MIN_COLLABORATORS) {
      const newCollaborators = collaborators.slice(0, -1);
      const equalPercentage = Math.floor(100 / newCollaborators.length);

      setCollaborators(
        newCollaborators.map(c => ({ ...c, percentage: equalPercentage }))
      );
    }
  };

  const updateCollaborator = (index: number, field: keyof Omit<CollaboratorSplit, 'splitId' | 'groupId'>, value: string | number) => {
    const updated = [...collaborators];
    updated[index] = { ...updated[index], [field]: value };
    setCollaborators(updated);
    
    // Clear errors for this field
    const errorKey = `${field}-${index}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!groupName.trim()) {
      newErrors.groupName = 'Group name is required';
    }

    collaborators.forEach((collaborator, index) => {
      if (!collaborator.displayName.trim()) {
        newErrors[`displayName-${index}`] = 'Display name is required';
      }
      
      if (!collaborator.collaboratorWalletAddress.trim()) {
        newErrors[`collaboratorWalletAddress-${index}`] = 'Wallet address is required';
      } else if (!isValidAddress(collaborator.collaboratorWalletAddress)) {
        newErrors[`collaboratorWalletAddress-${index}`] = 'Invalid wallet address';
      }
      
      if (collaborator.percentage <= 0 || collaborator.percentage > 100) {
        newErrors[`percentage-${index}`] = 'Percentage must be between 1 and 100';
      }
    });

    if (!validatePercentages(collaborators)) {
      newErrors.percentages = 'Percentages must add up to 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateGroup = async () => {
    if (!validateForm()) return;

    setIsCreating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const groupId = generateId();
      
      // In a real app, you would save to backend/blockchain here
      console.log('Creating group:', {
        groupId,
        groupName,
        collaborators,
      });
      
      onViewChange('tip', groupId);
    } catch (error) {
      console.error('Failed to create group:', error);
      setErrors({ general: 'Failed to create group. Please try again.' });
    } finally {
      setIsCreating(false);
    }
  };

  const totalPercentage = collaborators.reduce((sum, c) => sum + c.percentage, 0);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onViewChange('welcome')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <h2 className="text-xl font-bold text-white">Create Collaboration Group</h2>
      </div>

      {/* Group Name */}
      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Group Name
            </label>
            <Input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., Gaming Stream Duo"
              error={errors.groupName}
            />
          </div>
        </div>
      </Card>

      {/* Collaborators */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Collaborators ({collaborators.length})
            </h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={removeLastCollaborator}
                disabled={collaborators.length <= MIN_COLLABORATORS}
                className="flex items-center space-x-1"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={addCollaborator}
                disabled={collaborators.length >= MAX_COLLABORATORS}
                className="flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {collaborators.map((collaborator, index) => (
              <CollaboratorListItem
                key={index}
                collaborator={collaborator}
                index={index}
                onUpdate={updateCollaborator}
                errors={errors}
                canRemove={collaborators.length > MIN_COLLABORATORS}
                onRemove={() => removeCollaborator(index)}
              />
            ))}
          </div>

          {/* Percentage Summary */}
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Total Percentage:</span>
              <span className={`font-semibold ${
                Math.abs(totalPercentage - 100) < 0.01 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {totalPercentage.toFixed(1)}%
              </span>
            </div>
            {errors.percentages && (
              <p className="text-red-400 text-sm mt-2">{errors.percentages}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        {errors.general && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
            <p className="text-red-400 text-sm">{errors.general}</p>
          </div>
        )}
        
        <Button
          onClick={handleCreateGroup}
          disabled={isCreating || !validatePercentages(collaborators)}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          {isCreating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Creating Group...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Create Group</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
