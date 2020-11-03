import React from 'react';

import { Container } from './styles';

interface TooltipProps {
  title: string;
  className?: string; // Permitir que o componente receba classes externas, ou seja, estilização vinda através de outro componente
}

const Tooltip: React.FC<TooltipProps> = ({ title, className, children }) => {
  return (
    <Container className={className}>
      {/* O children é o ícone */}
      {children}
      <span>{title}</span>
    </Container>
  );
};

export default Tooltip;
