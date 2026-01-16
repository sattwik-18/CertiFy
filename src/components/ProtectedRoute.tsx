import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

// Simple redirect or render children
export const ProtectedRoute: React.FC<{ children: React.ReactNode, fallback: React.ReactNode }> = ({ children, fallback }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
