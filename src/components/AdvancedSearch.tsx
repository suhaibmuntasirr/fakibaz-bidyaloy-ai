import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Filter, Star, Download, Clock, User, 
  BookOpen, GraduationCap, TrendingUp, X 
} from 'lucide-react';
import { searchService, SearchResult, SearchFilters } from '@/services/searchService';
import { analyticsService } from '@/services/analyticsService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AdvancedSearchProps {
  onResultSelect?: (result: SearchResult) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onResultSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'all'
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadPopularSearches();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.length > 2) {
        loadSuggestions();
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const loadPopularSearches = async () => {
    try {
      const searches = await searchService.getPopularSearches();
      setPopularSearches(searches);
    } catch (error) {
      console.error('Error loading popular searches:', error);
    }
  };

  const loadSuggestions = async () => {
    try {
      const suggestions = await searchService.getSuggestions(query);
      setSuggestions(suggestions);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const searchFilters: SearchFilters = {
        ...filters,
        query: query.trim()
      };

      console.log('Searching with Algolia...', searchFilters);
      const searchResults = await searchService.search(searchFilters);
      setResults(searchResults);
      setSuggestions([]);

      // Track search analytics
      await analyticsService.trackSearch(query, searchResults.length, currentUser?.uid);

      if (searchResults.length === 0) {
        toast({
          title: "কোন ফলাফল পাওয়া যায়নি",
          description: "অন্য শব্দ দিয়ে খোঁজ করুন",
        });
      } else {
        toast({
          title: "খোঁজ সম্পন্ন",
          description: `${searchResults.length}টি ফলাফল পাওয়া গেছে`,
        });
      }
    } catch (error) {
      toast({
        title: "খোঁজে সমস্যা",
        description: "আবার চেষ্টা করুন",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
    setTimeout(handleSearch, 100);
  };

  const handleResultClick = (result: SearchResult) => {
    if (onResultSelect) {
      onResultSelect(result);
    }

    // Track result click
    analyticsService.trackEvent({
      name: 'search_result_click',
      parameters: {
        result_id: result.id,
        result_type: result.type,
        query: query,
        position: results.indexOf(result)
      },
      userId: currentUser?.uid
    });
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      type: 'all'
    });
  };

  const getResultIcon = (type: string) => {
    return type === 'note' ? <BookOpen className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />;
  };

  const getTypeColor = (type: string) => {
    return type === 'note' ? 'bg-blue-600' : 'bg-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Search className="mr-2 h-5 w-5 text-blue-400" />
            উন্নত খোঁজ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="নোট, প্রশ্ন বা বিষয় খুঁজুন..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
                />
                {query && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuery('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Filter className="h-4 w-4 mr-2" />
                ফিল্টার
              </Button>
              <Button
                onClick={handleSearch}
                disabled={!query.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Search className="h-4 w-4 mr-2" />
                খুঁজুন
              </Button>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-lg border border-white/20 rounded-lg z-50">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2 text-white hover:bg-white/10 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white/5 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">ফিল্টার অপশন</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-400 hover:text-white"
                >
                  রিসেট করুন
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
                  value={filters.type || 'all'}
                  onValueChange={(value) => handleFilterChange('type', value)}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="ধরন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">সব</SelectItem>
                    <SelectItem value="note">নোট</SelectItem>
                    <SelectItem value="question">প্রশ্ন</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.class || ''}
                  onValueChange={(value) => handleFilterChange('class', value)}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="ক্লাস" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">সব ক্লাস</SelectItem>
                    <SelectItem value="Class 6">ষষ্ঠ শ্রেণী</SelectItem>
                    <SelectItem value="Class 7">সপ্তম শ্রেণী</SelectItem>
                    <SelectItem value="Class 8">অষ্টম শ্রেণী</SelectItem>
                    <SelectItem value="Class 9">নবম শ্রেণী</SelectItem>
                    <SelectItem value="Class 10">দশম শ্রেণী</SelectItem>
                    <SelectItem value="Class 11">একাদশ শ্রেণী</SelectItem>
                    <SelectItem value="Class 12">দ্বাদশ শ্রেণী</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.subject || ''}
                  onValueChange={(value) => handleFilterChange('subject', value)}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="বিষয়" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">সব বিষয়</SelectItem>
                    <SelectItem value="গণিত">গণিত</SelectItem>
                    <SelectItem value="পদার্থবিজ্ঞান">পদার্থবিজ্ঞান</SelectItem>
                    <SelectItem value="রসায়ন">রসায়ন</SelectItem>
                    <SelectItem value="জীববিজ্ঞান">জীববিজ্ঞান</SelectItem>
                    <SelectItem value="বাংলা">বাংলা</SelectItem>
                    <SelectItem value="ইংরেজি">ইংরেজি</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.rating?.toString() || ''}
                  onValueChange={(value) => handleFilterChange('rating', value ? Number(value) : undefined)}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="রেটিং" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">সব রেটিং</SelectItem>
                    <SelectItem value="4">৪+ স্টার</SelectItem>
                    <SelectItem value="3">৩+ স্টার</SelectItem>
                    <SelectItem value="2">২+ স্টার</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Popular Searches */}
          {!query && popularSearches.length > 0 && (
            <div>
              <h4 className="text-white text-sm font-medium mb-2 flex items-center">
                <TrendingUp className="mr-2 h-4 w-4 text-yellow-400" />
                জনপ্রিয় খোঁজ
              </h4>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(search)}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {results.length > 0 && (
        <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">
              খোঁজের ফলাফল ({results.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 cursor-pointer transition-all hover:bg-white/10"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(result.type)}/20 text-white`}>
                      {getResultIcon(result.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-1">{result.title}</h3>
                      {result.snippet && (
                        <p className="text-gray-400 text-sm mb-2">{result.snippet}</p>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {result.author}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          {result.rating.toFixed(1)}
                        </div>
                        <div className="flex items-center">
                          <Download className="h-3 w-3 mr-1" />
                          {result.downloads}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="text-blue-300 border-blue-600/30">
                          {result.class}
                        </Badge>
                        <Badge variant="outline" className="text-green-300 border-green-600/30">
                          {result.subject}
                        </Badge>
                        <Badge variant="outline" className={`text-white border-white/30 ${getTypeColor(result.type)}/20`}>
                          {result.type === 'note' ? 'নোট' : 'প্রশ্ন'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
          <CardContent className="py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-400">খোঁজ চলছে...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedSearch;
