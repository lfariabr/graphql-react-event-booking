// app/components/DebugAuth.tsx
"use client";

import { useAuth } from "../context/auth-context";
import { useEffect, useState } from 'react';

export default function DebugAuth() {
  const { token, userId, isAuthenticated, logout } = useAuth();
  const { getTokenExpiration } = useAuth();
  const [timeLeft, setTimeLeft] = useState('--:--');

  useEffect(() => {
    const update = () => {
        const { isExpired, expiresIn } = getTokenExpiration();
        if (isExpired) {
            setTimeLeft('Expired');
            return;
        }
        
        const minutes = Math.floor(expiresIn / 60000);
        const seconds = Math.floor((expiresIn % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };
    
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
}, [getTokenExpiration]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '14px',
      zIndex: 1000,
      maxWidth: '300px'
    }}>
      <h4>Auth Debug</h4>
      <p>Status: {isAuthenticated ? '✅ Authenticated' : '❌ Not authenticated'}</p>
      <p>User ID: {userId || 'None'}</p>
      <p>Token: {token ? `${token.substring(0, 10)}...` : 'None'}</p>
      {isAuthenticated && (
        <button 
          onClick={logout}
          style={{
            background: '#ff4444',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '3px',
            cursor: 'pointer',
            marginTop: '5px'
          }}
        >
          Logout
        </button>
      )}
      <p>Token expires in: {timeLeft}</p>
    </div>
  );
}