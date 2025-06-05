import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  increment, 
  arrayUnion, 
  arrayRemove, 
  query, 
  orderBy, 
  where, 
  limit,
  getDoc,
  setDoc 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export interface UploadedNote {
  id: string;
  title: string;
  class: string;
  subject: string;
  chapter?: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  authorId: string;
  authorName: string;
  createdAt: Date;
  likes: number;
  likedBy: string[];
  downloads: number;
  downloadedBy: string[];
  comments: number;
  rating: number;
  ratingCount: number;
  verified: boolean;
  tags: string[];
}

export interface UploadedQuestion {
  id: string;
  title: string;
  class: string;
  subject: string;
  school?: string;
  year?: string;
  examType?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks?: string;
  description?: string;
  questionFileUrl: string;
  answerFileUrl?: string;
  questionFileName: string;
  answerFileName?: string;
  fileSize: number;
  authorId: string;
  authorName: string;
  createdAt: Date;
  likes: number;
  likedBy: string[];
  downloads: number;
  downloadedBy: string[];
  comments: number;
  rating: number;
  ratingCount: number;
  verified: boolean;
  tags: string[];
}

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  points: number;
  notesUploaded: number;
  questionsUploaded: number;
  badge: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  joinedAt: Date;
  lastActive: Date;
}

class FirebaseService {
  // Upload file to Firebase Storage
  async uploadFile(file: File, path: string): Promise<string> {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }

  // Calculate points based on rating and engagement
  calculatePoints(rating: number, downloads: number, likes: number, uploadType: 'note' | 'question'): number {
    let basePoints = uploadType === 'note' ? 10 : 15;
    let qualityMultiplier = 1;
    let bonusPoints = 0;

    // Rating-based quality multiplier
    if (rating >= 4.8) {
      qualityMultiplier = 3.0;
      bonusPoints += 50;
    } else if (rating >= 4.5) {
      qualityMultiplier = 2.5;
      bonusPoints += 30;
    } else if (rating >= 4.0) {
      qualityMultiplier = 2.0;
      bonusPoints += 20;
    } else if (rating >= 3.5) {
      qualityMultiplier = 1.5;
      bonusPoints += 10;
    } else if (rating >= 3.0) {
      qualityMultiplier = 1.2;
      bonusPoints += 5;
    }

    const downloadBonus = Math.min(downloads * 2, 100);
    const likeBonus = Math.min(likes * 3, 75);

    return Math.floor((basePoints + downloadBonus + likeBonus) * qualityMultiplier + bonusPoints);
  }

  // Upload Note with points calculation
  async uploadNote(noteData: Omit<UploadedNote, 'id' | 'createdAt'>, file: File): Promise<string> {
    try {
      const filePath = `notes/${Date.now()}_${file.name}`;
      const fileUrl = await this.uploadFile(file, filePath);
      
      const noteDoc = {
        ...noteData,
        fileUrl,
        fileName: file.name,
        fileSize: file.size,
        createdAt: new Date(),
        likes: 0,
        likedBy: [],
        downloads: 0,
        downloadedBy: [],
        comments: 0,
        rating: 0,
        ratingCount: 0,
        verified: false,
        tags: [noteData.class, noteData.subject]
      };

      const docRef = await addDoc(collection(db, 'notes'), noteDoc);
      
      // Update user points with base upload points
      await this.updateUserPoints(noteData.authorId, 10);
      
      return docRef.id;
    } catch (error) {
      console.error('Error uploading note:', error);
      throw error;
    }
  }

  // Upload Question
  async uploadQuestion(
    questionData: Omit<UploadedQuestion, 'id' | 'createdAt'>, 
    questionFile: File, 
    answerFile?: File
  ): Promise<string> {
    try {
      const questionFilePath = `questions/${Date.now()}_${questionFile.name}`;
      const questionFileUrl = await this.uploadFile(questionFile, questionFilePath);
      
      let answerFileUrl = '';
      let answerFileName = '';
      
      if (answerFile) {
        const answerFilePath = `answers/${Date.now()}_${answerFile.name}`;
        answerFileUrl = await this.uploadFile(answerFile, answerFilePath);
        answerFileName = answerFile.name;
      }
      
      const questionDoc = {
        ...questionData,
        questionFileUrl,
        answerFileUrl,
        questionFileName: questionFile.name,
        answerFileName,
        fileSize: questionFile.size,
        createdAt: new Date(),
        likes: 0,
        likedBy: [],
        downloads: 0,
        downloadedBy: [],
        comments: 0,
        rating: 0,
        ratingCount: 0,
        verified: false,
        tags: [questionData.class, questionData.subject]
      };

      const docRef = await addDoc(collection(db, 'questions'), questionDoc);
      
      // Update user points
      await this.updateUserPoints(questionData.authorId, 15);
      
      return docRef.id;
    } catch (error) {
      console.error('Error uploading question:', error);
      throw error;
    }
  }

  // Get Notes
  async getNotes(filters?: { class?: string; subject?: string; sortBy?: string }): Promise<UploadedNote[]> {
    try {
      let queries = [];
      
      if (filters?.class && filters.class !== 'all') {
        queries.push(where('class', '==', filters.class));
      }
      
      if (filters?.subject && filters.subject !== 'all') {
        queries.push(where('subject', '==', filters.subject));
      }
      
      // Apply sorting
      if (filters?.sortBy === 'popular') {
        queries.push(orderBy('likes', 'desc'));
      } else if (filters?.sortBy === 'rating') {
        queries.push(orderBy('rating', 'desc'));
      } else {
        queries.push(orderBy('createdAt', 'desc'));
      }
      
      const q = query(collection(db, 'notes'), ...queries);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as UploadedNote));
    } catch (error) {
      console.error('Error getting notes:', error);
      return [];
    }
  }

  // Get Questions
  async getQuestions(filters?: { class?: string; subject?: string; year?: string; school?: string; sortBy?: string }): Promise<UploadedQuestion[]> {
    try {
      let queries = [];
      
      if (filters?.class && filters.class !== 'all') {
        queries.push(where('class', '==', filters.class));
      }
      
      if (filters?.subject && filters.subject !== 'all') {
        queries.push(where('subject', '==', filters.subject));
      }
      
      if (filters?.year && filters.year !== 'all') {
        queries.push(where('year', '==', filters.year));
      }
      
      if (filters?.school && filters.school !== 'all') {
        queries.push(where('school', '==', filters.school));
      }
      
      // Apply sorting
      if (filters?.sortBy === 'popular') {
        queries.push(orderBy('likes', 'desc'));
      } else if (filters?.sortBy === 'rating') {
        queries.push(orderBy('rating', 'desc'));
      } else {
        queries.push(orderBy('createdAt', 'desc'));
      }
      
      const q = query(collection(db, 'questions'), ...queries);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as UploadedQuestion));
    } catch (error) {
      console.error('Error getting questions:', error);
      return [];
    }
  }

  // Like Note/Question
  async likeItem(itemId: string, userId: string, type: 'note' | 'question'): Promise<boolean> {
    try {
      const collectionName = type === 'note' ? 'notes' : 'questions';
      const itemRef = doc(db, collectionName, itemId);
      const itemDoc = await getDoc(itemRef);
      
      if (!itemDoc.exists()) return false;
      
      const itemData = itemDoc.data();
      const likedBy = itemData.likedBy || [];
      const isLiked = likedBy.includes(userId);
      
      if (isLiked) {
        // Unlike
        await updateDoc(itemRef, {
          likes: increment(-1),
          likedBy: arrayRemove(userId)
        });
      } else {
        // Like
        await updateDoc(itemRef, {
          likes: increment(1),
          likedBy: arrayUnion(userId)
        });
        
        // Award points to author
        if (itemData.authorId !== userId) {
          await this.updateUserPoints(itemData.authorId, 2);
        }
      }
      
      return !isLiked;
    } catch (error) {
      console.error('Error liking item:', error);
      return false;
    }
  }

  // Download Note/Question
  async downloadItem(itemId: string, userId: string, type: 'note' | 'question'): Promise<boolean> {
    try {
      const collectionName = type === 'note' ? 'notes' : 'questions';
      const itemRef = doc(db, collectionName, itemId);
      const itemDoc = await getDoc(itemRef);
      
      if (!itemDoc.exists()) return false;
      
      const itemData = itemDoc.data();
      const downloadedBy = itemData.downloadedBy || [];
      
      if (!downloadedBy.includes(userId)) {
        await updateDoc(itemRef, {
          downloads: increment(1),
          downloadedBy: arrayUnion(userId)
        });
        
        // Award points to author
        if (itemData.authorId !== userId) {
          await this.updateUserPoints(itemData.authorId, 5);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error downloading item:', error);
      return false;
    }
  }

  // Update User Points
  async updateUserPoints(userId: string, points: number): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        points: increment(points),
        lastActive: new Date()
      });
    } catch (error) {
      console.error('Error updating user points:', error);
    }
  }

  // Get Leaderboard
  async getLeaderboard(limitCount: number = 10): Promise<UserProfile[]> {
    try {
      const q = query(
        collection(db, 'users'),
        orderBy('points', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      } as UserProfile));
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  }

  // Create or Update User Profile
  async createOrUpdateUserProfile(userData: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userData.uid!);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create new user profile
        await setDoc(userRef, {
          ...userData,
          points: 0,
          notesUploaded: 0,
          questionsUploaded: 0,
          badge: 'Bronze',
          joinedAt: new Date(),
          lastActive: new Date()
        });
      } else {
        // Update existing profile
        await updateDoc(userRef, {
          ...userData,
          lastActive: new Date()
        });
      }
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
    }
  }

  // Update rating and recalculate points
  async updateRating(itemId: string, userId: string, rating: number, type: 'note' | 'question'): Promise<void> {
    try {
      const collectionName = type === 'note' ? 'notes' : 'questions';
      const itemRef = doc(db, collectionName, itemId);
      const itemDoc = await getDoc(itemRef);
      
      if (!itemDoc.exists()) return;
      
      const itemData = itemDoc.data();
      const newRatingCount = itemData.ratingCount + 1;
      const newRating = ((itemData.rating * itemData.ratingCount) + rating) / newRatingCount;
      
      await updateDoc(itemRef, {
        rating: newRating,
        ratingCount: newRatingCount
      });

      // Recalculate and update author points
      const newPoints = this.calculatePoints(newRating, itemData.downloads, itemData.likes, type);
      await this.updateAuthorPointsForItem(itemData.authorId, itemId, newPoints);
      
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  }

  // Update author points for specific item
  async updateAuthorPointsForItem(authorId: string, itemId: string, newPoints: number): Promise<void> {
    try {
      // Store item-specific points to track changes
      const pointsRef = doc(db, 'userPoints', `${authorId}_${itemId}`);
      const pointsDoc = await getDoc(pointsRef);
      
      let pointsDifference = newPoints;
      if (pointsDoc.exists()) {
        const oldPoints = pointsDoc.data().points || 0;
        pointsDifference = newPoints - oldPoints;
      }

      // Update item-specific points record
      await setDoc(pointsRef, {
        authorId,
        itemId,
        points: newPoints,
        lastUpdated: new Date()
      });

      // Update user's total points
      if (pointsDifference !== 0) {
        await this.updateUserPoints(authorId, pointsDifference);
      }
    } catch (error) {
      console.error('Error updating author points for item:', error);
    }
  }

  // Get user's earnings
  async getUserEarnings(userId: string): Promise<{ totalPoints: number; totalEarnings: number; monthlyEarnings: number }> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return { totalPoints: 0, totalEarnings: 0, monthlyEarnings: 0 };
      }

      const userData = userDoc.data();
      const totalPoints = userData.points || 0;
      const totalEarnings = totalPoints * 0.5; // 1 point = 0.5 BDT
      
      // Calculate monthly earnings (points earned this month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      // This would need to be implemented based on monthly point tracking
      const monthlyEarnings = totalEarnings; // Simplified for now
      
      return {
        totalPoints,
        totalEarnings,
        monthlyEarnings
      };
    } catch (error) {
      console.error('Error getting user earnings:', error);
      return { totalPoints: 0, totalEarnings: 0, monthlyEarnings: 0 };
    }
  }
}

export const firebaseService = new FirebaseService();
