
// Analytics service for tracking user behavior
// Note: Set your analytics API keys in environment variables

export interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, any>;
  userId?: string;
}

export interface UserActivity {
  userId: string;
  action: string;
  resourceId?: string;
  resourceType?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

class AnalyticsService {
  private googleAnalyticsId = ''; // Set your GA4 measurement ID
  private mixpanelToken = ''; // Set your Mixpanel token

  // Track custom events
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      // Google Analytics 4
      if (this.googleAnalyticsId && typeof gtag !== 'undefined') {
        gtag('event', event.name, {
          custom_parameter: event.parameters,
          user_id: event.userId
        });
      }

      // Mixpanel
      if (this.mixpanelToken && typeof mixpanel !== 'undefined') {
        mixpanel.track(event.name, {
          ...event.parameters,
          user_id: event.userId
        });
      }

      // Store in Firebase for custom analytics
      await this.storeActivityInFirebase(event);
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  private async storeActivityInFirebase(event: AnalyticsEvent): Promise<void> {
    try {
      const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      await addDoc(collection(db, 'userActivity'), {
        eventName: event.name,
        parameters: event.parameters || {},
        userId: event.userId,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Firebase analytics error:', error);
    }
  }

  // Predefined tracking methods
  async trackPageView(pageName: string, userId?: string): Promise<void> {
    await this.trackEvent({
      name: 'page_view',
      parameters: {
        page_title: pageName,
        page_location: window.location.href
      },
      userId
    });
  }

  async trackNoteDownload(noteId: string, noteTitle: string, userId?: string): Promise<void> {
    await this.trackEvent({
      name: 'note_download',
      parameters: {
        note_id: noteId,
        note_title: noteTitle
      },
      userId
    });
  }

  async trackQuestionView(questionId: string, questionTitle: string, userId?: string): Promise<void> {
    await this.trackEvent({
      name: 'question_view',
      parameters: {
        question_id: questionId,
        question_title: questionTitle
      },
      userId
    });
  }

  async trackSearch(query: string, resultsCount: number, userId?: string): Promise<void> {
    await this.trackEvent({
      name: 'search',
      parameters: {
        search_term: query,
        results_count: resultsCount
      },
      userId
    });
  }

  async trackLike(contentId: string, contentType: 'note' | 'question', userId?: string): Promise<void> {
    await this.trackEvent({
      name: 'content_like',
      parameters: {
        content_id: contentId,
        content_type: contentType
      },
      userId
    });
  }

  async trackComment(contentId: string, contentType: 'note' | 'question', userId?: string): Promise<void> {
    await this.trackEvent({
      name: 'content_comment',
      parameters: {
        content_id: contentId,
        content_type: contentType
      },
      userId
    });
  }

  async trackUpload(contentType: 'note' | 'question', subject: string, className: string, userId?: string): Promise<void> {
    await this.trackEvent({
      name: 'content_upload',
      parameters: {
        content_type: contentType,
        subject,
        class: className
      },
      userId
    });
  }

  async trackSubscription(planName: string, amount: number, userId?: string): Promise<void> {
    await this.trackEvent({
      name: 'subscription_purchase',
      parameters: {
        plan_name: planName,
        value: amount,
        currency: 'BDT'
      },
      userId
    });
  }

  async trackAIInteraction(question: string, responseTime: number, userId?: string): Promise<void> {
    await this.trackEvent({
      name: 'ai_interaction',
      parameters: {
        question_length: question.length,
        response_time: responseTime
      },
      userId
    });
  }

  // User journey tracking
  async trackUserJourney(step: string, userId: string): Promise<void> {
    await this.trackEvent({
      name: 'user_journey',
      parameters: {
        journey_step: step,
        timestamp: new Date().toISOString()
      },
      userId
    });
  }

  // Performance tracking
  async trackPerformance(metricName: string, value: number): Promise<void> {
    await this.trackEvent({
      name: 'performance_metric',
      parameters: {
        metric_name: metricName,
        metric_value: value
      }
    });
  }
}

export const analyticsService = new AnalyticsService();
