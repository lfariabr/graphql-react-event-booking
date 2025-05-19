import { createContext, useContext } from "react";

interface AuthContextType {
    token: string | null;
    userId: string | null;
    login: (token: string, userId: string, tokenExpiration: Date) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    getTokenExpiration: () => { 
        isExpired: boolean; 
        expiresIn: number; // milliseconds until expiration
        expiresAt: Date | null;
    };
}

export const AuthContext = createContext<AuthContextType>({
    token: null,
    userId: null,
    login: async () => {},
    logout: () => {},
    isAuthenticated: false,
    getTokenExpiration: () => ({ isExpired: false, expiresIn: 0, expiresAt: null }),
});

export const useAuth = () => {
    return useContext(AuthContext);
}