
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { LogIn, LogOut, Menu, X, BookOpen, FileText, Users, Crown, ChevronDown, Settings as SettingsIcon, Home } from 'lucide-react';
import NotificationDropdown from '@/components/NotificationDropdown';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-auto">
      <nav className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl px-10">
        <div className="flex items-center justify-between h-16 gap-12">
          {/* Logo Only */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src="/lovable-uploads/48bd98a0-c7ee-4b45-adf1-cca6b79289b4.png" 
              alt="Fakibaz Logo"
              className="w-12 h-12"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <Link 
              to="/" 
              className="text-white hover:text-blue-400 transition-colors flex items-center text-lg font-medium"
            >
              <Home className="mr-2 h-5 w-5" />
              হোম
            </Link>
            <Link 
              to="/notes" 
              className="text-white hover:text-blue-400 transition-colors flex items-center text-lg font-medium"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              নোট
            </Link>
            <Link 
              to="/question-bank" 
              className="text-white hover:text-blue-400 transition-colors flex items-center text-lg font-medium"
            >
              <FileText className="mr-2 h-5 w-5" />
              প্রশ্ন ব্যাংক
            </Link>
            <Link 
              to="/community" 
              className="text-white hover:text-blue-400 transition-colors flex items-center text-lg font-medium"
            >
              <Users className="mr-2 h-5 w-5" />
              কমিউনিটি
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <NotificationDropdown />

            {/* User Menu */}
            {currentUser ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-white hover:bg-white/10"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.photoURL || undefined} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {currentUser.displayName?.[0] || currentUser.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </Button>

                {showUserMenu && (
                  <div className="absolute right-0 top-12 w-48 bg-black/90 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-white font-medium">
                        {currentUser.displayName || 'ব্যবহারকারী'}
                      </p>
                      <p className="text-gray-400 text-sm">{currentUser.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/settings');
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-white/10 flex items-center"
                    >
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      সেটিংস
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/subscription');
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-white/10 flex items-center"
                    >
                      <Crown className="mr-2 h-4 w-4" />
                      প্রিমিয়াম
                    </button>
                    
                    <div className="border-t border-white/10 mt-2 pt-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/10 flex items-center"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        লগ আউট
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-lg"
              >
                <LogIn className="mr-2 h-4 w-4" />
                লগইন
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:bg-white/10"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl mt-2 py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-white hover:text-blue-400 transition-colors flex items-center px-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="mr-2 h-4 w-4" />
                হোম
              </Link>
              <Link 
                to="/notes" 
                className="text-white hover:text-blue-400 transition-colors flex items-center px-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                নোট
              </Link>
              <Link 
                to="/question-bank" 
                className="text-white hover:text-blue-400 transition-colors flex items-center px-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FileText className="mr-2 h-4 w-4" />
                প্রশ্ন ব্যাংক
              </Link>
              <Link 
                to="/community" 
                className="text-white hover:text-blue-400 transition-colors flex items-center px-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users className="mr-2 h-4 w-4" />
                কমিউনিটি
              </Link>
            </div>
          </div>
        )}
    </div>
  );
};

export default Navbar;
