// app/components/DebugAuth.tsx
"use client";

import { useAuth } from "../context/auth-context";

export default function DebugAuth() {
  const { token, userId, isAuthenticated, logout } = useAuth();
  
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
    </div>
  );
}