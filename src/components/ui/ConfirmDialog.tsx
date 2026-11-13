import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  isLoading = false,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
    <div className="flex items-start gap-4">
      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${type === 'danger' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
        <AlertTriangle className="w-5 h-5" />
      </div>
      <p className="text-sm text-slate-600 leading-relaxed pt-2">{description}</p>
    </div>
    <div className="mt-6 flex justify-end gap-2">
      <Button variant="outline" onClick={onClose} disabled={isLoading}>{cancelText}</Button>
      <Button variant={type === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} isLoading={isLoading}>{confirmText}</Button>
    </div>
  </Modal>
);
