import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

// import Tooltip from '../Tooltip';

import { Container, Error } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  // transformando o nome em obrigatório
  name: string;
  // Recebendo um componente como propriedade (Icones)
  // Passando como parâmetro pro icon, todas as propriedades que um react-icon tem como padrão
  icon: React.ComponentType<IconBaseProps>;
  // Recebendo essa propriedade para estilizar o container e não o input
  containerStyle?: object;
}

// É necessário trocar o nome da variável para o react entender que estamos tratando de um Componente
// Recebendo o container style no componente para repassar para dentro do container
const Input: React.FC<InputProps> = ({
  name,
  containerStyle = {},
  icon: Icon,
  ...rest
}) => {
  // Pegando a referência pra qualquer elemento na DOM
  // Com isso posso fazer qualquer coisa com o elemento, colocar focus, setar valor etc
  const inputRef = useRef<HTMLInputElement>(null); // Passando para a função useRef o tipo dela, que no caso é um input
  const { fieldName, defaultValue, error, registerField } = useField(name);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  /**
   * Toda vez que eu criar funções dentro de um componente, utilizar o hook useCallback
   * A fim de evitar que a função seja recriada na memória toda vez que o componente for chamado
   */
  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    // ?. verifica se o campo está preenchido
    // !! se tiver algúm valor, o retorno disso é true, se não tiver é falso
    // Transaformando em boolean
    setIsFilled(!!inputRef.current?.value);
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current, // dentro do current tem o input, acesso no HTML
      // pegando o valor do input
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    // Repassando o estilo pro container
    <Container
      style={containerStyle}
      isErrored={!!error}
      isFilled={isFilled}
      isFocused={isFocused}
      data-testid="input-container"
    >
      {/* Como eu to componentizando, existem alguns imputs no layout que não recebem ícones, então tenho que verificar essa condição  */}
      {Icon && <Icon size={20} />}
      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        {...rest}
      />

      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default Input;
