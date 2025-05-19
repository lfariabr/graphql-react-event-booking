"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/auth-context';
import { Button } from "@/app/components/ui/button";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

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
        <header className="border-b">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center space-x-8">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="/logo.png"
                            alt="BooQme Logo"
                            width={40}
                            height={40}
                            priority
                            className="h-10 w-10"
                        />
                        <span className="text-lg font-semibold">BooQme</span>
                    </Link>
                    
                    <nav className="hidden md:flex items-center space-x-4">
                        <Link 
                            href="/" 
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                isActive("/") ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            Home
                        </Link>
                        
                        {isAuthenticated && (
                            <>
                                <Link 
                                    href="/events/create"
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary",
                                        isActive("/events/create") ? "text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    Create Event
                                </Link>
                                <Link 
                                    href="/events/view"
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary",
                                        isActive("/events/view") ? "text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    View Events
                                </Link>
                                <Link 
                                    href="/bookings"
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary",
                                        isActive("/bookings") ? "text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    Bookings
                                </Link>
                            </>
                        )}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">{timeLeft}</span>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => logout()}
                                className="gap-2"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button 
                                variant="outline" 
                                size="sm"
                                className={cn(
                                    isActive("/login") && "bg-accent text-accent-foreground"
                                )}
                            >
                                Sign in
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;