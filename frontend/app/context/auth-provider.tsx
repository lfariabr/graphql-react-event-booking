"use client";

import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./auth-context";
import { useRouter } from "next/navigation";

// TODO: Implement token refresh and expiration handling
// - Add token expiration handling
// - Add refreshToken function 
// - Add isTokenExpiringSoon check
// - Set up auto-refresh logic

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    
    const login = useCallback(async (newToken: string, newUserId: string) => {
        setToken(newToken);
        setUserId(newUserId);
        const item = {
            token: newToken,
            userId: newUserId,
        };
        localStorage.setItem("userData", JSON.stringify(item));

        console.log("Login successful:", newToken, newUserId);
    }, []);

    const decodeToken = (token: string) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (error) {
            return null;
        }
    }

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        localStorage.removeItem("userData");
        router.push("/login");
        console.log("Logout successful");
    }, [router]);

    const getTokenExpiration = useCallback((): { 
        isExpired: boolean; 
        expiresIn: number; // milliseconds until expiration
        expiresAt: Date | null;
    } => {
        if (!token) return { 
            isExpired: true, 
            expiresIn: 0, 
            expiresAt: null 
        };
    
        try {
            const decoded = decodeToken(token);
            if (!decoded?.exp) {
                return { 
                    isExpired: true, 
                    expiresIn: 0, 
                    expiresAt: null 
                };
            }
    
            const expiresAt = new Date(decoded.exp * 1000);
            const expiresIn = expiresAt.getTime() - Date.now();
            
            return {
                isExpired: expiresIn <= 0,
                expiresIn: Math.max(0, expiresIn), // Never return negative
                expiresAt
            };
        } catch {
            return { 
                isExpired: true, 
                expiresIn: 0, 
                expiresAt: null 
            };
        }
    }, [token]);

    // Single useEffect for all auth-related side effects
    useEffect(() => {
        const storedData = localStorage.getItem('userData');
        if (!storedData) return;
        
        try {
            const { token: storedToken, userId: storedUserId } = JSON.parse(storedData);

            if (!storedToken || !storedUserId) {
                throw new Error("Invalid auth data");
            }
            
            const decodedToken = decodeToken(storedToken);
            if (!decodedToken) {
                throw new Error("Invalid token");
            }

            const isExpired = decodedToken.exp * 1000 < Date.now();
            if (isExpired) {
                console.log("Token expired, clearing...");
                logout();
                return;
            }

            setToken(storedToken);
            setUserId(storedUserId);
            console.log("Auto login successful");

            const timeUntilExpiration = decodedToken.exp * 1000 - Date.now();
            const logoutTimer = setTimeout(() => {
                console.log("Token expired, logging out...");
                logout();
            }, timeUntilExpiration);

            return () => clearTimeout(logoutTimer);
            
        } catch (error) {
            console.error("Error parsing stored auth data:", error);
            logout();
        }
    }, [logout]);

    const value = {
        token,
        userId,
        login,
        logout,
        isAuthenticated: !!token,
        getTokenExpiration,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
        