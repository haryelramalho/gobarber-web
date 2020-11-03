import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
}

/**
 * Isso é uma DIV que tem um INPUT e um ICON dentro.
 */
export const Container = styled.div<ContainerProps>`
  display: flex;
  align-items: center;

  background: #232129;
  border-radius: 10px;
  padding: 16px;
  /* Ocupa 100% do espaço disponível */
  width: 100%;
  border: 2px solid #232129;
  color: #666360;

  & + div {
    margin-top: 8px;
  }

  /* A do erro vem primeiro por que, quando damos foco a borda troca de vermelha pra laranja */

  ${props =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}

  /* Pegando a propriedade isFocused, caso ele esteja focado (isFocused=true), aplicar esses estilos */
  ${props =>
    props.isFocused &&
    css`
      color: #ff9000;
      border-color: #ff9000;
    `}

  ${props =>
    props.isFilled &&
    css`
      color: #ff9000;
    `}

  input {
    flex: 1;
    background: transparent;
    border: 0;
    color: #f4ede8;

    &::placeholder {
      color: #666360;
    }
  }

  /* A margem fica no ícone, por que se ele não existir, não preciso ter margem no input */
  svg {
    margin-right: 16px;
  }
`;

// O erro será um tooltip
// Para fazer isso, devo permitir que o Tooltip receba className lá no componente
export const Error = styled(Tooltip)`
  /* setando o tamanho da div pro tamanho do ícone */
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0;
  }

  /* Estilizando o tooltip para vermelho por se tratar de um tooltip de erro */
  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
