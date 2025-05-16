"use client";

import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./auth-context";
import { useRouter } from "next/navigation";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    
    const login = useCallback(async (newToken: string, newUserId: string) => {
        setToken(newToken);
        setUserId(newUserId);
        localStorage.setItem("userData", JSON.stringify({ 
            token: newToken, 
            userId: newUserId 
        }));
        console.log("Login successful:", newToken, newUserId);
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        localStorage.removeItem("userData");
        router.push("/login");
        console.log("Logout successful");
    }, [router]);

    // Auto login from localStorage
    useEffect(() => {
        const storedData = localStorage.getItem('userData');
        console.log("Auto login attempt:", storedData);
        if (storedData) {
            const { token: storedToken, userId: storedUserId } = JSON.parse(storedData);
            console.log("Auto login successful:", storedToken, storedUserId);
            if (storedToken && storedUserId) {
                setToken(storedToken);
                setUserId(storedUserId);
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
        