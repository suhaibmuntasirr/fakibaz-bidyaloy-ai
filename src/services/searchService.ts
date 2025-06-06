import { algoliasearch } from 'algoliasearch';

// Advanced search service with Algolia integration
export interface SearchResult {
  id: string;
  title: string;
  type: 'note' | 'question';
  subject: string;
  class: string;
  author: string;
  rating: number;
  downloads: number;
  snippet: string;
  relevanceScore: number;
}

export interface SearchFilters {
  query: string;
  type?: 'note' | 'question' | 'all';
  subject?: string;
  class?: string;
  difficulty?: string;
  rating?: number;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

class SearchService {
  private client = algoliasearch('0DOY2W5HXJ', '58cba489ac1115d4b83f952bed5ea396');
  private indexName = 'educational_content';

  async search(filters: SearchFilters): Promise<SearchResult[]> {
    try {
      // Use Algolia search
      return await this.algoliaSearch(filters);
    } catch (error) {
      console.error('Algolia search error:', error);
      // Fallback to Firebase search
      return await this.firebaseSearch(filters);
    }
  }

  private async algoliaSearch(filters: SearchFilters): Promise<SearchResult[]> {
    const searchParams = {
      query: filters.query,
      filters: this.buildAlgoliaFilters(filters),
      hitsPerPage: 50,
      attributesToHighlight: ['title', 'description'],
      attributesToSnippet: ['description:20']
    };

    const response = await this.client.search({
      requests: [{
        indexName: this.indexName,
        ...searchParams
      }]
    });

    // Fix: Properly access the hits from the search response
    const searchResult = response.results[0];
    if ('hits' in searchResult) {
      const hits = searchResult.hits;
      return hits.map((hit: any) => ({
        id: hit.objectID,
        title: hit.title,
        type: hit.type,
        subject: hit.subject,
        class: hit.class,
        author: hit.author,
        rating: hit.rating || 0,
        downloads: hit.downloads || 0,
        snippet: hit._snippetResult?.description?.value || hit.description || '',
        relevanceScore: hit._rankingInfo?.nbExactWords || 0
      }));
    }
    
    return [];
  }

  // Index educational content to Algolia
  async indexEducationalContent() {
    try {
      console.log('Starting to index educational content...');
      
      // Sample educational data - replace with your actual data
      const educationalContent = [
        {
          objectID: '1',
          title: 'গণিতের মৌলিক সূত্রাবলী',
          description: 'দশম শ্রেণীর গণিতের সকল মৌলিক সূত্র এবং তাদের প্রয়োগ',
          type: 'note',
          subject: 'গণিত',
          class: 'Class 10',
          author: 'রফিক স্যার',
          rating: 4.5,
          downloads: 150,
          tags: ['সূত্র', 'গণিত', 'দশম শ্রেণী']
        },
        {
          objectID: '2',
          title: 'পদার্থবিজ্ঞান - নিউটনের সূত্র',
          description: 'নিউটনের গতির তিনটি সূত্র এবং তাদের ব্যাখ্যা',
          type: 'note',
          subject: 'পদার্থবিজ্ঞান',
          class: 'Class 9',
          author: 'সালমা ম্যাডাম',
          rating: 4.8,
          downloads: 200,
          tags: ['পদার্থবিজ্ঞান', 'নিউটন', 'গতি']
        },
        {
          objectID: '3',
          title: 'রসায়ন প্রশ্ন ব্যাংক',
          description: 'একাদশ শ্রেণীর রসায়নের গুরুত্বপূর্ণ প্রশ্ন সমূহ',
          type: 'question',
          subject: 'রসায়ন',
          class: 'Class 11',
          author: 'করিম স্যার',
          rating: 4.2,
          downloads: 120,
          tags: ['রসায়ন', 'প্রশ্ন', 'একাদশ শ্রেণী']
        },
        {
          objectID: '4',
          title: 'বাংলা ব্যাকরণ - কারক',
          description: 'বাংলা ব্যাকরণের কারক অধ্যায়ের বিস্তারিত আলোচনা',
          type: 'note',
          subject: 'বাংলা',
          class: 'Class 8',
          author: 'রহিমা ম্যাডাম',
          rating: 4.3,
          downloads: 180,
          tags: ['বাংলা', 'ব্যাকরণ', 'কারক']
        },
        {
          objectID: '5',
          title: 'ইংরেজি গ্রামার - Tense',
          description: 'ইংরেজি গ্রামারের টেন্স সম্পর্কে বিস্তারিত',
          type: 'note',
          subject: 'ইংরেজি',
          class: 'Class 7',
          author: 'জনাব আহমেদ',
          rating: 4.6,
          downloads: 220,
          tags: ['ইংরেজি', 'গ্রামার', 'টেন্স']
        }
      ];

      // Index the content
      await this.client.saveObjects({
        indexName: this.indexName,
        objects: educationalContent
      });

      console.log('Successfully indexed educational content!');
      return true;
    } catch (error) {
      console.error('Error indexing content:', error);
      return false;
    }
  }

  private async firebaseSearch(filters: SearchFilters): Promise<SearchResult[]> {
    // Import Firebase services here to avoid circular dependencies
    const { firebaseService } = await import('./firebaseService');
    
    try {
      // Get both notes and questions
      const [notes, questions] = await Promise.all([
        firebaseService.getNotes({
          class: filters.class,
          subject: filters.subject,
          sortBy: 'recent'
        }),
        firebaseService.getQuestions({
          class: filters.class,
          subject: filters.subject,
          sortBy: 'recent'
        })
      ]);

      // Combine and filter results
      const allResults: SearchResult[] = [
        ...notes.map(note => ({
          id: note.id,
          title: note.title,
          type: 'note' as const,
          subject: note.subject,
          class: note.class,
          author: note.authorName,
          rating: note.rating,
          downloads: note.downloads,
          snippet: note.description || '',
          relevanceScore: this.calculateRelevance(note.title, filters.query)
        })),
        ...questions.map(question => ({
          id: question.id,
          title: question.title,
          type: 'question' as const,
          subject: question.subject,
          class: question.class,
          author: question.authorName,
          rating: question.rating,
          downloads: question.downloads,
          snippet: question.description || '',
          relevanceScore: this.calculateRelevance(question.title, filters.query)
        }))
      ];

      // Filter by type
      let filteredResults = allResults;
      if (filters.type && filters.type !== 'all') {
        filteredResults = allResults.filter(result => result.type === filters.type);
      }

      // Filter by query
      if (filters.query) {
        filteredResults = filteredResults.filter(result =>
          result.title.toLowerCase().includes(filters.query.toLowerCase()) ||
          result.snippet.toLowerCase().includes(filters.query.toLowerCase())
        );
      }

      // Sort by relevance
      filteredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

      return filteredResults.slice(0, 50); // Limit results
    } catch (error) {
      console.error('Firebase search error:', error);
      return [];
    }
  }

  private buildAlgoliaFilters(filters: SearchFilters): string {
    const conditions: string[] = [];
    
    if (filters.type && filters.type !== 'all') {
      conditions.push(`type:${filters.type}`);
    }
    
    if (filters.subject) {
      conditions.push(`subject:"${filters.subject}"`);
    }
    
    if (filters.class) {
      conditions.push(`class:"${filters.class}"`);
    }
    
    if (filters.rating) {
      conditions.push(`rating >= ${filters.rating}`);
    }

    return conditions.join(' AND ');
  }

  private calculateRelevance(title: string, query: string): number {
    if (!query) return 0;
    
    const titleLower = title.toLowerCase();
    const queryLower = query.toLowerCase();
    
    // Exact match gets highest score
    if (titleLower === queryLower) return 100;
    
    // Starts with query gets high score
    if (titleLower.startsWith(queryLower)) return 80;
    
    // Contains query gets medium score
    if (titleLower.includes(queryLower)) return 60;
    
    // Word-by-word matching
    const queryWords = queryLower.split(' ');
    const titleWords = titleLower.split(' ');
    const matchingWords = queryWords.filter(word => 
      titleWords.some(titleWord => titleWord.includes(word))
    );
    
    return (matchingWords.length / queryWords.length) * 40;
  }

  async getPopularSearches(): Promise<string[]> {
    // Return popular search terms - you can make this dynamic
    return [
      'গণিত সূত্র',
      'পদার্থবিজ্ঞান নোট',
      'রসায়ন সমীকরণ',
      'বাংলা ব্যাকরণ',
      'ইংরেজি গ্রামার',
      'জীববিজ্ঞান চিত্র',
      'ভূগোল মানচিত্র',
      'ইতিহাস তারিখ'
    ];
  }

  async getSuggestions(query: string): Promise<string[]> {
    // Return search suggestions based on query
    const suggestions = [
      'গণিত সূত্র তালিকা',
      'পদার্থবিজ্ঞান নিউটনের সূত্র',
      'রসায়ন জৈব যৌগ',
      'বাংলা ব্যাকরণ কারক',
      'ইংরেজি গ্রামার টেন্স'
    ];

    return suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }
}

export const searchService = new SearchService();
