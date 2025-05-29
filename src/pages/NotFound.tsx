
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Search, BookOpen } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#28282B] flex items-center justify-center px-4">
      <Card className="bg-black/20 backdrop-blur-lg border border-white/10 max-w-md w-full">
        <CardContent className="text-center p-8">
          <div className="text-6xl font-bold text-white mb-4">404</div>
          <h1 className="text-2xl font-bold text-white mb-2">পেজ খুঁজে পাওয়া যায়নি</h1>
          <p className="text-gray-300 mb-6">
            দুঃখিত, আপনি যে পেজটি খুঁজছেন সেটি বিদ্যমান নেই বা সরানো হয়েছে।
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Home className="mr-2 h-4 w-4" />
              হোম পেজে ফিরে যান
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/notes'}
              className="w-full bg-black/30 border-white/20 text-white hover:bg-white/10"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              নোট দেখুন
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/community'}
              className="w-full bg-black/30 border-white/20 text-white hover:bg-white/10"
            >
              <Search className="mr-2 h-4 w-4" />
              কমিউনিটিতে যান
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
