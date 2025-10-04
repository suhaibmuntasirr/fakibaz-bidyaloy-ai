import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { LogIn, LogOut, Menu, X, BookOpen, FileText, Users, Crown, Settings as SettingsIcon, Home } from 'lucide-react';
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
    <nav className="sticky top-4 z-50 mx-auto max-w-6xl px-4">
      <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Logo Only */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src="/lovable-uploads/48bd98a0-c7ee-4b45-adf1-cca6b79289b4.png" 
              alt="Logo"
              className="w-10 h-10"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-white transition-colors flex items-center text-base font-medium"
            >
              <Home className="mr-1 h-4 w-4" />
              হোম
            </Link>
            <Link 
              to="/notes" 
              className="text-gray-300 hover:text-white transition-colors flex items-center text-base font-medium"
            >
              <BookOpen className="mr-1 h-4 w-4" />
              নোট
            </Link>
            <Link 
              to="/question-bank" 
              className="text-gray-300 hover:text-white transition-colors flex items-center text-base font-medium"
            >
              <FileText className="mr-1 h-4 w-4" />
              প্রশ্ন ব্যাংক
            </Link>
            <Link 
              to="/community" 
              className="text-gray-300 hover:text-white transition-colors flex items-center text-base font-medium"
            >
              <Users className="mr-1 h-4 w-4" />
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
                  className="p-0 hover:bg-transparent"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUser.photoURL || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {currentUser.displayName?.[0] || currentUser.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>

                {showUserMenu && (
                  <div className="absolute right-0 top-14 w-56 bg-gray-900/95 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-700">
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
                      className="w-full text-left px-4 py-2 text-white hover:bg-gray-800 flex items-center rounded-xl mx-2 my-1"
                    >
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      সেটিংস
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/subscription');
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-gray-800 flex items-center rounded-xl mx-2 my-1"
                    >
                      <Crown className="mr-2 h-4 w-4" />
                      প্রিমিয়াম
                    </button>
                    
                    <div className="border-t border-gray-700 mt-2 pt-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 flex items-center rounded-xl mx-2 my-1"
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
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full px-6"
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
              className="md:hidden text-white hover:bg-white/10 p-2"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/20">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-gray-300 hover:text-white transition-colors flex items-center px-3 py-2 rounded-lg hover:bg-white/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="mr-2 h-4 w-4" />
                হোম
              </Link>
              <Link 
                to="/notes" 
                className="text-gray-300 hover:text-white transition-colors flex items-center px-3 py-2 rounded-lg hover:bg-white/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                নোট
              </Link>
              <Link 
                to="/question-bank" 
                className="text-gray-300 hover:text-white transition-colors flex items-center px-3 py-2 rounded-lg hover:bg-white/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FileText className="mr-2 h-4 w-4" />
                প্রশ্ন ব্যাংক
              </Link>
              <Link 
                to="/community" 
                className="text-gray-300 hover:text-white transition-colors flex items-center px-3 py-2 rounded-lg hover:bg-white/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users className="mr-2 h-4 w-4" />
                কমিউনিটি
              </Link>
              
              {currentUser && (
                <>
                  <Link 
                    to="/settings" 
                    className="text-gray-300 hover:text-white transition-colors flex items-center px-3 py-2 rounded-lg hover:bg-white/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    সেটিংস
                  </Link>
                  <Link 
                    to="/subscription" 
                    className="text-gray-300 hover:text-white transition-colors flex items-center px-3 py-2 rounded-lg hover:bg-white/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    প্রিমিয়াম
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-red-400 hover:text-red-300 transition-colors flex items-center px-3 py-2 rounded-lg hover:bg-white/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    লগ আউট
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
