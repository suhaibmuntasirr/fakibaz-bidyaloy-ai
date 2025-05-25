
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { currentUser } = useAuth();

  // Redirect if already authenticated
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleAuthSuccess = () => {
    // User will be automatically redirected by the auth state change
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#28282B] via-[#1a1a1d] to-[#28282B] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Welcome */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">ফাকিবাজ</h1>
          <p className="text-gray-300">বাংলাদেশের প্রথম AI-চালিত শিক্ষা প্ল্যাটফর্ম</p>
        </div>

        {/* Auth Toggle */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-4">
          <CardContent className="pt-6">
            <div className="flex rounded-lg bg-white/10 p-1">
              <Button
                variant={isLogin ? "default" : "ghost"}
                className={`flex-1 ${isLogin ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setIsLogin(true)}
              >
                লগইন
              </Button>
              <Button
                variant={!isLogin ? "default" : "ghost"}
                className={`flex-1 ${!isLogin ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setIsLogin(false)}
              >
                রেজিস্টার
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Auth Forms */}
        {isLogin ? (
          <LoginForm onSuccess={handleAuthSuccess} />
        ) : (
          <RegisterForm onSuccess={handleAuthSuccess} />
        )}

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            {isLogin ? "নতুন ব্যবহারকারী? " : "ইতিমধ্যে অ্যাকাউন্ট আছে? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {isLogin ? "রেজিস্টার করুন" : "লগইন করুন"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
