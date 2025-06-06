
// Advanced search service with multiple providers
// Note: API keys should be set in environment variables

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
  private algoliaAppId = ''; // Set your Algolia App ID
  private algoliaApiKey = ''; // Set your Algolia Search API Key
  private algoliaIndex = 'educational_content'; // Your Algolia index name

  async search(filters: SearchFilters): Promise<SearchResult[]> {
    try {
      // Primary search using Algolia (when configured)
      if (this.algoliaAppId && this.algoliaApiKey) {
        return await this.algoliaSearch(filters);
      }
      
      // Fallback to Firebase search
      return await this.firebaseSearch(filters);
    } catch (error) {
      console.error('Search error:', error);
      // Always fallback to Firebase search
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

    const response = await fetch(`https://${this.algoliaAppId}-dsn.algolia.net/1/indexes/${this.algoliaIndex}/query`, {
      method: 'POST',
      headers: {
        'X-Algolia-Application-Id': this.algoliaAppId,
        'X-Algolia-API-Key': this.algoliaApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchParams)
    });

    const data = await response.json();
    return data.hits.map((hit: any) => ({
      id: hit.objectID,
      title: hit.title,
      type: hit.type,
      subject: hit.subject,
      class: hit.class,
      author: hit.author,
      rating: hit.rating,
      downloads: hit.downloads,
      snippet: hit._snippetResult?.description?.value || '',
      relevanceScore: hit._rankingInfo?.nbExactWords || 0
    }));
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
