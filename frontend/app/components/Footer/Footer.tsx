import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="border-t">
            <div className="container flex flex-col md:flex-row items-center justify-between py-8 gap-6">
                {/* Left Section: Logo and Name */}
                <div className="flex items-center space-x-3">
                    <Image
                        src="/logo.png"
                        alt="BooQme Logo"
                        width={40}
                        height={40}
                        className="h-10 w-10"
                    />
                    <span className="text-lg font-semibold">BooQme</span>
                </div>

                {/* Center Section: Links */}
                <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
                    <Link 
                        href="/about" 
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        About Us
                    </Link>
                    <Link 
                        href="/contact" 
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        Contact
                    </Link>
                    <Link 
                        href="/privacy" 
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        Privacy Policy
                    </Link>
                    <Link 
                        href="/terms" 
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        Terms of Service
                    </Link>
                </nav>

                {/* Right Section: Social Media Links */}
                <div className="flex items-center space-x-4">
                    <a
                        href="https://www.linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="LinkedIn"
                    >
                        <Linkedin className="h-5 w-5" />
                    </a>
                    <a
                        href="https://www.twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Twitter"
                    >
                        <Twitter className="h-5 w-5" />
                    </a>
                    <a
                        href="https://www.github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="GitHub"
                    >
                        <Github className="h-5 w-5" />
                    </a>
                </div>
            </div>
            
            {/* Copyright */}
            <div className="border-t py-4">
                <div className="container text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} BooQme. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;