import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Event Booking App</h1>
        <p>Book your event</p>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>

      </main>
      <Footer />
    </div>
  );
}
