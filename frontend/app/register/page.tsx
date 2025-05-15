"use client";
import styles from "../page.module.css";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Register: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (!formData.name || !formData.email || !formData.password) {
            setError("All fields are required");
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
                        mutation CreateUser($userInput: UserInput!) {
                            createUser(userInput: $userInput) {
                                _id
                                email
                                password
                                name
                            }
                        }
                    `,
                    variables: {
                        userInput: {
                            email: formData.email,
                            password: formData.password,
                            name: formData.name,
                        },
                    },
                }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            if (data.errors && data.errors.length > 0) {
                setError(data.errors[0].message || "Registration failed");
            } else {
                setSuccess("Registration successful!");
                setTimeout(() => {
                    router.push("/login");
                }, 1500);
            }
        } catch (err: any) {
            setError(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <h2>Register</h2>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    aria-label="Name"
                    required
                />
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-label="Email"
                    required
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    aria-label="Password"
                    required
                />
                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}
                {loading && <p className={styles.loading}>Loading...</p>}
                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default Register;