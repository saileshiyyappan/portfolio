'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

interface ModalContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  modalCount: number;
}

const ModalContext = createContext<ModalContextType>({
  isModalOpen: false,
  openModal: () => {},
  closeModal: () => {},
  modalCount: 0,
});

export function useModal() {
  return useContext(ModalContext);
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalCount, setModalCount] = useState(0);
  const isModalOpen = modalCount > 0;
  const prevOverflowRef = useRef('');

  useEffect(() => {
    if (isModalOpen) {
      prevOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = prevOverflowRef.current;
    }
    return () => {
      document.body.style.overflow = prevOverflowRef.current;
    };
  }, [isModalOpen]);

  const openModal = useCallback(() => {
    setModalCount((c) => c + 1);
  }, []);

  const closeModal = useCallback(() => {
    setModalCount((c) => Math.max(0, c - 1));
  }, []);

  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal, modalCount }}>
      {children}
    </ModalContext.Provider>
  );
}
