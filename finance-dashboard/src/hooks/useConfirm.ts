import { useState, useCallback } from 'react';

interface ConfirmState {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
}

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    message: '',
    onConfirm: () => {},
  });

  const showConfirm = useCallback((message: string, onConfirm: () => void) => {
    setConfirmState({
      isOpen: true,
      message,
      onConfirm,
    });
  }, []);

  const hideConfirm = useCallback(() => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    confirmState,
    showConfirm,
    hideConfirm,
  };
};
