import styled from 'styled-components';

export const Container = styled.div`
  /* Todo position absolute que está dentro do container vai ser relativo ao container e não ao restante da tela */
  position: relative;

  span {
    width: 160px;
    background: #ff9000;
    padding: 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    opacity: 0;
    transition: opacity 0.4s;
    /* Escondendo o elemento da DOM enquanto ele não estiver disponível pra ser visto */
    visibility: hidden;

    position: absolute;
    bottom: calc(100% + 12px);

    /* hackzinho para centralizar com o elemento de baixo */
    left: 50%;
    transform: translateX(-50%);

    color: #312e38;

    /* Criando uma flechinha com CSS usando border, o border-width seria formando o triângulo */
    &::before {
      content: '';
      border-style: solid;
      border-color: #ff9000 transparent;
      border-width: 6px 6px 0 6px;
      top: 100%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &:hover span {
    opacity: 1;
    visibility: visible;
  }
`;
