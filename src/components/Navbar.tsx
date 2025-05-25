
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, MessageCircle, Settings, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'AI শিক্ষক', path: '/', icon: MessageCircle },
    { name: 'নোট শেয়ার', path: '/notes', icon: BookOpen },
    { name: 'কমিউনিটি', path: '/community', icon: Users },
  ];

  return (
    <nav className="bg-[#28282B]/90 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="text-2xl font-bold text-white cursor-pointer hover:text-blue-400 transition-colors"
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
                  className={`text-white hover:text-blue-400 hover:bg-white/10 transition-all ${
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
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:text-blue-400 hover:bg-white/10"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <User className="mr-2 h-4 w-4" />
              লগইন
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:text-blue-400"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
