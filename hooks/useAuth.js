import { createContext, useContext } from 'react';
import { useState } from 'react';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function Provider({ children }) {
  const [user, setUser] = useState(null);
  const [name, setName] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser, name, setName }}>{children}</AuthContext.Provider>
  );
}
