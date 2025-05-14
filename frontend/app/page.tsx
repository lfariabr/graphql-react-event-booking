import styles from "./page.module.css";
import Link from "next/link";
import Footer from "./components/Footer";
import React from "react";

const Home: React.FC = () => {
    return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Event Booking App</h1>
        <p>Book your event</p>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
        <Link href="/bookings">Bookings</Link>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
