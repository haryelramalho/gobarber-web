import React, { useEffect } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
} from 'react-icons/fi';

import { ToastMessageData, useToast } from '../../../hooks/toast';

import { Container } from './styles';

interface ToastProps {
  message: ToastMessageData;
  style: object;
}

const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
};

const Toast: React.FC<ToastProps> = ({ message, style }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    /**
     * Se retornarmos uma função dentro do useEffect, ela é automaticamente executada se o componente morrer, deixar de existir
     * Nesse caso, se o usuário clicar no x não faz sentido remover um toast que já foi removido por outra fonte
     * No caso o removeToast foi executado em outro local e o toast morreu
     */
    return () => {
      clearTimeout(timer);
    };
  }, [message.id, removeToast]);

  return (
    <Container
      type={message.type}
      // transformando em boolean e verificando se tem descrição
      // transformando em numero 1 true e 0 false para não dar erro no HTML
      hasDescription={Number(!!message.description)}
      style={style}
    >
      {/* Como o type não é obrigatório, tenho que colocar um padrão */}
      {icons[message.type || 'info']}

      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>

      {/* Se eu passar handleRemoveToast(message.id)
            Isso vai executar no momento em que o componente for exibido em tela
            Por isso precisa-se de uma arrow function
          */}
      <button onClick={() => removeToast(message.id)} type="button">
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
