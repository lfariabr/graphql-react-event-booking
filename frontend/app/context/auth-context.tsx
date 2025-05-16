import { createContext, useContext } from "react";

interface AuthContextType {
    token: string | null;
    userId: string | null;
    login: (token: string, userId: string, tokenExpiration: Date) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    // TODO: Add isTokenExpiringSoon method 
}

export const AuthContext = createContext<AuthContextType>({
    token: null,
    userId: null,
    login: async () => {},
    logout: () => {},
    isAuthenticated: false,
});

export const useAuth = () => {
    return useContext(AuthContext);
}