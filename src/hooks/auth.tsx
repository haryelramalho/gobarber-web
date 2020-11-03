import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>; // Passando um método na interface
  signOut(): void;
  updateUser(user: User): void;
}

// Hackzinho, burlar a tipagem do typescript e deixar inicializar o objeto vazio
// Motivo: o usuário pode não estar logado, então tem que estar vazio mesmo
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  // Essa lógica para pegar o usuário e o token do LocalStorage só vai executar quando o usuário abrir ou recarregar a página
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    if (token && user) {
      // Enviar aqui também por que o usuário pode ter dado um f5 na página e precisamos também verificar
      api.defaults.headers.authorization = `Bearer ${token}`;

      // retornando o usuário como objeto novamente
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState; // Forçando o tipo caso ele seja vazio
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem('@GoBarber:token', token);
    // O user é um objeto, mas para salvar no localstorage preciso que ele fique como string
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));

    // Todas as requisições que o usuário logado fizer o token vai ser mandado
    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');

    // Setando como vazio novamente, ou seja não tem nenhum usuário logado
    setData({} as AuthState);
  }, []);

  // Partial<> usar uma inteface x mas com todos os campos sendo opcionais, entretanto,
  // o escopo de campos é limitado aquela interface
  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@GoBarber:user', JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// hook para autenticação
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}
