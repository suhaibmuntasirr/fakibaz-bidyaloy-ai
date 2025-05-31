
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, MessageCircle, User, HelpCircle, LogOut, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AccessibleButton from '@/components/AccessibleButton';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'AI শিক্ষক', path: '/', icon: MessageCircle },
    { name: 'নোট শেয়ার', path: '/notes', icon: BookOpen },
    { name: 'প্রশ্ন ব্যাংক', path: '/questionbank', icon: HelpCircle },
    { name: 'কমিউনিটি', path: '/community', icon: Users },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-[#28282B]/90 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50" role="navigation" aria-label="প্রধান নেভিগেশন">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate('/');
              }
            }}
            aria-label="ফাকিবাজ হোমপেজে যান"
          >
            ফাকিবাজ
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <AccessibleButton
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-white hover:bg-white/10"
              ariaLabel={isMobileMenuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </AccessibleButton>
          </div>

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <AccessibleButton
                  key={item.path}
                  variant="ghost"
                  className={`text-white hover:text-blue-400 hover:bg-white/10 transition-all rounded-xl ${
                    isActive ? 'text-blue-400 bg-white/10' : ''
                  }`}
                  onClick={() => navigate(item.path)}
                  ariaLabel={`${item.name} পেজে যান`}
                >
                  <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
                  {item.name}
                </AccessibleButton>
              );
            })}
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <AccessibleButton 
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
                    ariaLabel="ব্যবহারকারী মেনু"
                  >
                    <User className="mr-2 h-4 w-4" aria-hidden="true" />
                    {userProfile?.fullName || currentUser.email}
                  </AccessibleButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#28282B] border-white/20 text-white rounded-xl" align="end">
                  <DropdownMenuLabel>আমার অ্যাকাউন্ট</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem className="hover:bg-white/10 rounded-lg focus:bg-white/10">
                    <User className="mr-2 h-4 w-4" aria-hidden="true" />
                    প্রোফাইল
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem 
                    className="hover:bg-white/10 text-red-400 rounded-lg focus:bg-white/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                    লগআউট
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AccessibleButton 
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
                onClick={() => navigate('/auth')}
                ariaLabel="লগইন করুন"
              >
                <User className="mr-2 h-4 w-4" aria-hidden="true" />
                লগইন
              </AccessibleButton>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10" role="menu">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <AccessibleButton
                    key={item.path}
                    variant="ghost"
                    className={`w-full justify-start text-white hover:text-blue-400 hover:bg-white/10 transition-all rounded-xl ${
                      isActive ? 'text-blue-400 bg-white/10' : ''
                    }`}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    ariaLabel={`${item.name} পেজে যান`}
                    role="menuitem"
                  >
                    <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
                    {item.name}
                  </AccessibleButton>
                );
              })}
              
              <div className="pt-4 border-t border-white/10 mt-4">
                {currentUser ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-gray-300 text-sm">
                      {userProfile?.fullName || currentUser.email}
                    </div>
                    <AccessibleButton
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-white/10 rounded-xl"
                      ariaLabel="প্রোফাইল"
                      role="menuitem"
                    >
                      <User className="mr-2 h-4 w-4" aria-hidden="true" />
                      প্রোফাইল
                    </AccessibleButton>
                    <AccessibleButton
                      variant="ghost"
                      className="w-full justify-start text-red-400 hover:bg-white/10 rounded-xl"
                      onClick={handleLogout}
                      ariaLabel="লগআউট"
                      role="menuitem"
                    >
                      <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                      লগআউট
                    </AccessibleButton>
                  </div>
                ) : (
                  <AccessibleButton 
                    variant="outline"
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
                    onClick={() => {
                      navigate('/auth');
                      setIsMobileMenuOpen(false);
                    }}
                    ariaLabel="লগইন করুন"
                    role="menuitem"
                  >
                    <User className="mr-2 h-4 w-4" aria-hidden="true" />
                    লগইন
                  </AccessibleButton>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
