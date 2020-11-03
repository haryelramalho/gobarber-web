import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';

import api from '../../services/api';
import { AuthProvider, useAuth } from '../../hooks/auth';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: 'user-123',
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
      token: 'token-123',
    };

    apiMock.onPost('sessions').reply(200, apiResponse);

    // Verificando se a função localStorage.setItem() foi chamada
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      // Mockando o contexto para que o useAuth funcione
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'johndoe@example.com',
      password: '123456',
    });

    // Utilizamos esse método quando estamos tratando de funções assíncronas que alteram o estado
    // Esse método espera o result.current ser atualizado para então prosseguir
    await waitForNextUpdate();

    // Verificando se a funcão de set do storage foi chamada com esses parâmetros
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:token',
      apiResponse.token,
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user),
    );

    /** Quando fazemos o login, o hook seta no estado o usuário com as credenciais
     * Nesse caso estamos verificando se ele setou o e-mail
     */
    expect(result.current.user.email).toEqual('johndoe@example.com');
  });

  it('should restore saved data from storage when auth inits', () => {
    /**
     * Fazendo um mock do getItem para trazer um usuário
     */
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-123';
        case '@GoBarber:user':
          return JSON.stringify({
            name: 'John Doe',
            email: 'johndoe@example.com',
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      // Mockando o contexto para que o useAuth funcione
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toEqual('johndoe@example.com');
  });

  it('should be able to signOut', () => {
    /**
     * Fazendo um mock do getItem para trazer um usuário logado
     */
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-123';
        case '@GoBarber:user':
          return JSON.stringify({
            name: 'John Doe',
            email: 'johndoe@example.com',
          });
        default:
          return null;
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      // Mockando o contexto para que o useAuth funcione
      wrapper: AuthProvider,
    });

    // Quando estamos utilizando um método que altera o estado em funções síncronas podemos utilizar o act por volta
    // Para esperar o estado ser setado
    act(() => {
      result.current.signOut();
    });

    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    expect(result.current.user).toBeUndefined();
  });

  it('should be update user', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      // Mockando o contexto para que o useAuth funcione
      wrapper: AuthProvider,
    });

    // Criando um objeto usuário para chamar no método de updateUser
    const user = {
      id: 'user-123',
      name: 'John Doe',
      email: 'johndoe@example.com',
      avatar_url: 'image.jpg',
    };

    // Como a função updateUser é sincrona e utilizamos o estado nela, vamos usar o act por fora
    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );

    expect(result.current.user).toEqual(user);
  });
});
