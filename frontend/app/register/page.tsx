import styles from "../page.module.css";
import Footer from "../components/Footer";

export default function Register() {
    return (
        <div className={styles.page}>
            <h2>Register</h2>
            <form className={styles.form}>
                <input type="text" placeholder="Name" />
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button type="submit">Register</button>
            </form>
            <Footer />
        </div>
    );
}