import React from 'react';
import Image from 'next/image';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            {/* Left Section: Logo and Name */}
            <div className={styles.left}>
                <Image
                    src="/logo.png"
                    alt="Site Logo"
                    width={50}
                    height={50}
                />
                <span>BooQme</span>
            </div>

            {/* Center Section: Links */}
            <div className={styles.center}>
                <a href="/about">About Us</a>
                <a href="/contact">Contact</a>
                <a href="/privacy">Privacy Policy</a>
                <a href="/terms">Terms of Service</a>
            </div>

            {/* Right Section: Social Media Links */}
            <div className={styles.right}>
                <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        src="/linkedin.svg"
                        alt="LinkedIn"
                        width={24}
                        height={24}
                    />
                </a>
                <a
                    href="https://www.twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        src="/twitter.svg"
                        alt="Twitter"
                        width={24}
                        height={24}
                    />
                </a>
                <a
                    href="https://www.github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        src="/github.svg"
                        alt="GitHub"
                        width={24}
                        height={24}
                    />
                </a>
            </div>
        </footer>
    );
};

export default Footer;