"use client";
import styles from "../page.module.css";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
// frontend/app/context/auth-context.tsx
import { useAuth } from "../context/auth-context";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        if (!email || !password) {
            setError("Both fields are required");
            setLoading(false);
            return;
        }
        try {
            const response = await fetch("http://localhost:8000/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `
                        mutation Login($email: String!, $password: String!) {
                            login(email: $email, password: $password) {
                                userId
                                token
                                tokenExpiration
                            }
                        }
                    `,
                    variables: {
                        email: email,
                        password: password,
                    },
                }),
            });
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            const data = await response.json();
            if (data.errors && data.errors.length > 0) {
                setError(data.errors[0].message || "Login failed");
            } else {
                console.log("Login successful:", data.data.login.userId);
                login(data.data.login.token, data.data.login.userId);
                router.push("/events/view");
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError("Login failed");
        }
    }
    return (
        <div className={styles.page}>
            <h2>Login</h2>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <label htmlFor="email">Email</label>
                <input 
                id="email"
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
                <label htmlFor="password">Password</label>
                <input 
                id="password"
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" className={styles.button} disabled={loading}>Login</button>
                <p>No account? <a className={styles.link} href="/register">Register here</a></p>
            </form>
        </div>
    );
};

export default Login;
