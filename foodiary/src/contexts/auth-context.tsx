import { createContext } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={{
        isLoggedIn: false,
        isLoading: false
    }}>
      {children}
    </AuthContext.Provider>
  );
}
