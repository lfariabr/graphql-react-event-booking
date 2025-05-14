"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link href="/">
                    <Image
                        src="/logo.png"
                        alt="BooQme Logo"
                        width={80}
                        height={80}
                        priority
                    />
                </Link>
            </div>
            <ul className={styles.navLinks}>
                <li><Link href="/" className={isActive("/") ? styles.active : ""}>Home</Link></li>
                <li><Link href="/login" className={isActive("/login") ? styles.active : ""}>Login</Link></li>
                <li><Link href="/register" className={isActive("/register") ? styles.active : ""}>Register</Link></li>
                <li><Link href="/events/create" className={isActive("/events/create") ? styles.active : ""}>Create Event</Link></li>
                <li><Link href="/events/view" className={isActive("/events/view") ? styles.active : ""}>View Events</Link></li>
                <li><Link href="/bookings" className={isActive("/bookings") ? styles.active : ""}>Bookings</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;