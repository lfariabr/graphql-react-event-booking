import styles from "../page.module.css";
import Footer from "../components/Footer";
import React from "react";

const Bookings: React.FC = () => {
    return (
        <div className={styles.page}>
            <h2>Bookings</h2>
            <p>Check the bookings</p>
            <Footer />
        </div>
    );
};

export default Bookings;