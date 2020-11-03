import React from 'react';

import { AuthProvider } from './auth';
import { ToastProvider } from './toast';

// Modularizando os Hooks que vão ficar no App
const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <ToastProvider>{children}</ToastProvider>
  </AuthProvider>
);

export default AppProvider;
