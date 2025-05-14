import styles from "../page.module.css";
import React from "react";

const Login: React.FC = () => {
    return (
        <div className={styles.page}>
            <h2>Login</h2>
            <form className={styles.form}>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
