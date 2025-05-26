
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

  // Upload Note
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
      
      // Update user points
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
      let q = collection(db, 'notes');
      
      if (filters?.class && filters.class !== 'all') {
        q = query(collection(db, 'notes'), where('class', '==', filters.class));
      }
      
      if (filters?.subject && filters.subject !== 'all') {
        q = query(q, where('subject', '==', filters.subject));
      }
      
      // Apply sorting
      if (filters?.sortBy === 'popular') {
        q = query(q, orderBy('likes', 'desc'));
      } else if (filters?.sortBy === 'rating') {
        q = query(q, orderBy('rating', 'desc'));
      } else {
        q = query(q, orderBy('createdAt', 'desc'));
      }
      
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
      let q = collection(db, 'questions');
      
      if (filters?.class && filters.class !== 'all') {
        q = query(collection(db, 'questions'), where('class', '==', filters.class));
      }
      
      if (filters?.subject && filters.subject !== 'all') {
        q = query(q, where('subject', '==', filters.subject));
      }
      
      if (filters?.year && filters.year !== 'all') {
        q = query(q, where('year', '==', filters.year));
      }
      
      if (filters?.school && filters.school !== 'all') {
        q = query(q, where('school', '==', filters.school));
      }
      
      // Apply sorting
      if (filters?.sortBy === 'popular') {
        q = query(q, orderBy('likes', 'desc'));
      } else if (filters?.sortBy === 'rating') {
        q = query(q, orderBy('rating', 'desc'));
      } else {
        q = query(q, orderBy('createdAt', 'desc'));
      }
      
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
  async getLeaderboard(limit: number = 10): Promise<UserProfile[]> {
    try {
      const q = query(
        collection(db, 'users'),
        orderBy('points', 'desc'),
        limit(limit)
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
}

export const firebaseService = new FirebaseService();
