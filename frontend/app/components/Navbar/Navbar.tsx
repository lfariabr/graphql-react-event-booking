"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/auth-context';

const Navbar: React.FC = () => {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;
    const { isAuthenticated, logout } = useAuth();
    
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
                {isAuthenticated ? (
                    <>
                        <li><Link href="/events/create" className={isActive("/events/create") ? styles.active : ""}>Create Event</Link></li>
                        <li><Link href="/events/view" className={isActive("/events/view") ? styles.active : ""}>View Events</Link></li>
                        <li><Link href="/bookings" className={isActive("/bookings") ? styles.active : ""}>Bookings</Link></li>
                        <li><button className={styles.button} onClick={() => logout()}>Logout</button></li>
                    </>
                ) : (
                    <li><Link href="/login" className={isActive("/login") ? styles.active : ""}>Login</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;