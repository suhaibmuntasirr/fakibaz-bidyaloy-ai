
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, MessageCircle, User, HelpCircle, LogOut } from 'lucide-react';
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

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile, logout } = useAuth();

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

  return (
    <nav className="bg-[#28282B]/90 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/')}
          >
            ফাকিবাজ
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  className={`text-white hover:text-blue-400 hover:bg-white/10 transition-all rounded-xl ${
                    isActive ? 'text-blue-400 bg-white/10' : ''
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
                  >
                    <User className="mr-2 h-4 w-4" />
                    {userProfile?.fullName || currentUser.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#28282B] border-white/20 text-white rounded-xl">
                  <DropdownMenuLabel>আমার অ্যাকাউন্ট</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem className="hover:bg-white/10 rounded-lg">
                    <User className="mr-2 h-4 w-4" />
                    প্রোফাইল
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem 
                    className="hover:bg-white/10 text-red-400 rounded-lg"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    লগআউট
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
                onClick={() => navigate('/auth')}
              >
                <User className="mr-2 h-4 w-4" />
                লগইন
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
