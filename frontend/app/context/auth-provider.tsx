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
    
    const login = useCallback(async (newToken: string, newUserId: string, expiration: Date) => {
        setToken(newToken);
        setUserId(newUserId);

        // Store token and user ID in localStorage
        const item = {
            token: newToken,
            userId: newUserId,
            expiration: expiration.toISOString(),
        };

        localStorage.setItem("userData", JSON.stringify(item));
        console.log("Login successful:", newToken, newUserId);
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        localStorage.removeItem("userData");
        router.push("/login");
        console.log("Logout successful");
    }, [router]);

    // Single useEffect for all auth-related side effects
    useEffect(() => {
        // 1. Load token from localStorage on mount
        const storedData = localStorage.getItem('userData');
        if (storedData) {
            try {
                const { token: storedToken, userId: storedUserId, expiration } = JSON.parse(storedData);
                const expirationDate = new Date(expiration);
                const now = new Date();
            
            if (storedToken && storedUserId && expirationDate > now) {
                setToken(storedToken);
                setUserId(storedUserId);
                console.log("Auto login successful");
            } else {
                console.log("Token expired or invalid, clearing...");
                logout();
            }
        } catch (error) {
            console.error("Error parsing stored auth data:", error);
            logout();
        }
        }
    }, []);


    const value = {
        token,
        userId,
        login,
        logout,
        isAuthenticated: !!token,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
        