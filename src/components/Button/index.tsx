import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

// Interface vazia, criando tipagem apenas
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => (
  // Cuidado para não passar para um elemento HTML um valor como boolean por que ele vai dar erro
  // Tem que passar como booelan convertendo pra number 1 true 0 false
  <Container type="button" {...rest}>
    {loading ? 'Carregando...' : children}
  </Container>
);

export default Button;
