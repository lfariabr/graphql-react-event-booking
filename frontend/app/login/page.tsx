import Footer from "../components/Footer";
import styles from "../page.module.css";

export default function Login() {
    return (
        <div className={styles.page}>
            <h2>Login</h2>
            <form className={styles.form}>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
            <Footer />
        </div>
    );
}