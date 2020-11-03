import React, { createContext, useCallback, useContext, useState } from 'react';

import { uuid } from 'uuidv4';

import ToastContainer from '../components/ToastContainer';

export interface ToastMessageData {
  // Como podemos ter vários toasts exibindo ao mesmo tempo teremos de fazer um map e precisaremos de uma key
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastContextData {
  addToast(message: Omit<ToastMessageData, 'id'>): void;
  removeToast(id: string): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessageData[]>([]);

  const addToast = useCallback(
    ({ type, title, description }: Omit<ToastMessageData, 'id'>) => {
      const id = uuid();

      const toast = {
        id,
        type,
        title,
        description,
      };

      // Pegando o estado anterior (todos os toasts) e adicionando o novo toast
      setMessages(state => [...state, toast]);
    },
    [],
  );
  const removeToast = useCallback((id: string) => {
    /**
     * Pegando o estado atual e filtrando em busca do id, se eu achar, ele vai retirar do array de messages
     */
    setMessages(state => state.filter(message => message.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

// Retorna os dados mantidos dentro do contexto de toast
function useToast(): ToastContextData {
  const context = useContext(ToastContext);

  if (!context) throw new Error('useToast must be used within a ToastProvider');

  return context;
}

export { ToastProvider, useToast };
