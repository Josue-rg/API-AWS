import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import Juegos from './Juegos';
import Login from './Login';

const App = () => {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
};

const MainContent = () => {
  const { user } = useAuth();

  return (
    <div>
      {user ? <Juegos /> : <Login />}
    </div>
  );
};

export default App;