import styled, { css } from 'styled-components';
// não é permitido fazer animação em elementos do HTML comum
import { animated } from 'react-spring';

interface ContainerProps {
  type?: 'success' | 'error' | 'info';
  hasDescription: number;
}

const toastTypeVariations = {
  info: css`
    background: #ebf8ff;
    color: #3172b7;
  `,
  success: css`
    background: #e6fffa;
    color: #2e656a;
  `,
  error: css`
    background: #fddede;
    color: #c53030;
  `,
};

export const Container = styled(animated.div)<ContainerProps>`
  width: 360px;
  /* Por que temos um position absolute dentro dele */
  position: relative;
  padding: 16px 30px 16px 16px;
  border-radius: 10px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);

  display: flex;

  & + div {
    margin-top: 8px;
  }

  /* Verifica o tipo do toast e estiliza de acordo com a posição no objeto de tipos de toast */
  ${props => toastTypeVariations[props.type || 'info']}

  /* > svg que está diretamente dentro do TOAST */
  > svg {
    margin: 4px 12px 0 0;
  }

  div {
    flex: 1;

    p {
      margin-top: 4px;
      font-size: 14px;
      /* para dar um efeito de cor mais fraca */
      opacity: 0.8;
      line-height: 20px;
    }
  }

  button {
    position: absolute;
    right: 16px;
    top: 19px;
    opacity: 0.6;
    border: 0;
    background: transparent;
    /* Pega a cor que está no container */
    color: inherit;
  }

  /* Caso não tenha descrição aplicar os seguintes efeitos */
  ${props =>
    !props.hasDescription &&
    css`
      align-items: center;

      svg {
        margin-top: 0;
      }
    `}
`;
