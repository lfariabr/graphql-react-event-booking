"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/auth-context';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Navbar: React.FC = () => {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;
    const { isAuthenticated, logout } = useAuth();
    const { getTokenExpiration } = useAuth();
    const { expiresIn } = getTokenExpiration();
    const minutes = Math.floor(expiresIn / 60000);
    const seconds = Math.floor((expiresIn % 60000) / 1000);
    const [timeLeft, setTimeLeft] = useState('--:--');
    
    useEffect(() => {
        const update = () => {
            const { expiresIn } = getTokenExpiration();
            const minutes = Math.floor(expiresIn / 60000);
            const seconds = Math.floor((expiresIn % 60000) / 1000);
            setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        };
        
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [getTokenExpiration]);
    
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
                        <li className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{timeLeft}</span>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => logout()}
                                className="gap-2"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Button>
                        </li>
                    </>
                ) : (
                    <Link href="/login">
                            <Button 
                                variant="outline" 
                                size="sm"
                                className={isActive("/login") ? "bg-accent" : ""}
                            >
                                Login
                            </Button>
                        </Link>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;