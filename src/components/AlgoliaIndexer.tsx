
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { searchService } from '@/services/searchService';
import { useToast } from '@/hooks/use-toast';

const AlgoliaIndexer: React.FC = () => {
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexStatus, setIndexStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleIndexContent = async () => {
    setIsIndexing(true);
    setIndexStatus('idle');

    try {
      const success = await searchService.indexEducationalContent();
      
      if (success) {
        setIndexStatus('success');
        toast({
          title: "সফলভাবে ইনডেক্স করা হয়েছে",
          description: "শিক্ষামূলক কন্টেন্ট Algolia তে যোগ করা হয়েছে",
        });
      } else {
        setIndexStatus('error');
        toast({
          title: "ইনডেক্স করতে সমস্যা",
          description: "আবার চেষ্টা করুন",
          variant: "destructive"
        });
      }
    } catch (error) {
      setIndexStatus('error');
      toast({
        title: "ইনডেক্স করতে সমস্যা",
        description: "আবার চেষ্টা করুন",
        variant: "destructive"
      });
    } finally {
      setIsIndexing(false);
    }
  };

  const getStatusIcon = () => {
    switch (indexStatus) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Database className="h-5 w-5 text-blue-400" />;
    }
  };

  const getStatusText = () => {
    switch (indexStatus) {
      case 'success':
        return 'সফলভাবে ইনডেক্স সম্পন্ন';
      case 'error':
        return 'ইনডেক্স করতে সমস্যা হয়েছে';
      default:
        return 'Algolia Search ইনডেক্স';
    }
  };

  return (
    <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          {getStatusIcon()}
          <span className="ml-2">{getStatusText()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-300 text-sm">
          Algolia সার্চ ইঞ্জিনে শিক্ষামূলক কন্টেন্ট ইনডেক্স করুন যাতে দ্রুত এবং সঠিক খোঁজ পাওয়া যায়।
        </p>
        
        <Button
          onClick={handleIndexContent}
          disabled={isIndexing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isIndexing ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              ইনডেক্স করা হচ্ছে...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              কন্টেন্ট ইনডেক্স করুন
            </>
          )}
        </Button>

        {indexStatus === 'success' && (
          <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-3">
            <p className="text-green-300 text-sm">
              ✅ ৫টি শিক্ষামূলক কন্টেন্ট সফলভাবে Algolia তে যোগ করা হয়েছে।
              এখন উন্নত খোঁজ ব্যবহার করুন!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlgoliaIndexer;
