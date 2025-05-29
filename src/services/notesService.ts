import { Note } from '@/types/common';

export interface Question {
  id: string;
  title: string;
  subject: string;
  class: string;
  school: string;
  year: number;
  examType: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  uploader: string;
  uploaderId: string;
  views: number;
  likes: number;
  answers: number;
  hasAnswerKey: boolean;
  uploadDate: Date;
  verified: boolean;
  questionFileUrl: string;
  answerFileUrl?: string;
  fileName: string;
  answerFileName?: string;
  likedBy: string[];
}

class NotesService {
  private notes: Note[] = [
    {
      id: '1',
      title: 'গণিত - দ্বিঘাত সমীকরণ সমাধান',
      subject: 'গণিত',
      class: 'Class 9',
      chapter: 'Chapter 3',
      author: 'রাহুল আহমেদ',
      authorId: 'user1',
      likes: 45,
      comments: 12,
      downloads: 89,
      rating: 4.8,
      tags: ['সমীকরণ', 'গণিত', 'অধ্যায়-৩'],
      uploadDate: new Date('2024-01-15'),
      verified: true,
      fileUrl: '/placeholder-note.pdf',
      fileName: 'quadratic-equations.pdf',
      fileSize: 2048000,
      description: 'দ্বিঘাত সমীকরণের বিস্তারিত সমাধান এবং উদাহরণ',
      likedBy: []
    },
    {
      id: '2',
      title: 'Physics - Motion in a Straight Line',
      subject: 'পদার্থবিজ্ঞান',
      class: 'Class 11',
      chapter: 'Chapter 2',
      author: 'সারা খান',
      authorId: 'user2',
      likes: 32,
      comments: 8,
      downloads: 67,
      rating: 4.5,
      tags: ['motion', 'physics', 'kinematics'],
      uploadDate: new Date('2024-01-10'),
      verified: false,
      fileUrl: '/placeholder-note.pdf',
      fileName: 'motion-straight-line.pdf',
      fileSize: 1536000,
      description: 'Complete notes on motion in a straight line with examples',
      likedBy: []
    },
    {
      id: '3',
      title: 'বাংলা ব্যাকরণ - সমাস',
      subject: 'বাংলা',
      class: 'Class 8',
      chapter: 'Chapter 5',
      author: 'তানিয়া রহমান',
      authorId: 'user3',
      likes: 78,
      comments: 23,
      downloads: 156,
      rating: 4.9,
      tags: ['ব্যাকরণ', 'সমাস', 'বাংলা'],
      uploadDate: new Date('2024-01-20'),
      verified: true,
      fileUrl: '/placeholder-note.pdf',
      fileName: 'bangla-grammar-shomash.pdf',
      fileSize: 3072000,
      description: 'বাংলা ব্যাকরণের সমাস অংশের সম্পূর্ণ নোট',
      likedBy: []
    }
  ];

  private questions: Question[] = [
    {
      id: '1',
      title: 'গণিত প্রি-টেস্ট পরীক্ষা - দ্বিঘাত সমীকরণ',
      subject: 'গণিত',
      class: 'Class 9',
      school: 'ঢাকা কলেজিয়েট স্কুল',
      year: 2024,
      examType: 'Pre-test',
      difficulty: 'Medium',
      marks: 50,
      uploader: 'রাহুল আহমেদ',
      uploaderId: 'user1',
      views: 245,
      likes: 34,
      answers: 12,
      hasAnswerKey: true,
      uploadDate: new Date('2024-01-15'),
      verified: true,
      questionFileUrl: '/placeholder-question.pdf',
      answerFileUrl: '/placeholder-answer.pdf',
      fileName: 'math-pretest-2024.pdf',
      answerFileName: 'math-pretest-answers-2024.pdf',
      likedBy: []
    },
    {
      id: '2',
      title: 'Physics Final Examination - Mechanics',
      subject: 'পদার্থবিজ্ঞান',
      class: 'Class 11',
      school: 'Notre Dame College',
      year: 2023,
      examType: 'Final',
      difficulty: 'Hard',
      marks: 100,
      uploader: 'সারা খান',
      uploaderId: 'user2',
      views: 189,
      likes: 28,
      answers: 8,
      hasAnswerKey: false,
      uploadDate: new Date('2024-01-10'),
      verified: true,
      questionFileUrl: '/placeholder-question.pdf',
      fileName: 'physics-final-2023.pdf',
      likedBy: []
    }
  ];

  // Notes methods
  getAllNotes(): Note[] {
    return this.notes;
  }

  getNoteById(id: string): Note | undefined {
    return this.notes.find(note => note.id === id);
  }

  searchNotes(query: string, filters: {
    class?: string;
    subject?: string;
    sortBy?: string;
  }): Note[] {
    let filtered = this.notes;

    if (query) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        note.author.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filters.class) {
      filtered = filtered.filter(note => note.class === filters.class);
    }

    if (filters.subject) {
      filtered = filtered.filter(note => note.subject === filters.subject);
    }

    // Sort
    switch (filters.sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());
    }

    return filtered;
  }

  uploadNote(noteData: Omit<Note, 'id' | 'likes' | 'comments' | 'downloads' | 'rating' | 'uploadDate' | 'likedBy'>): Note {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      likes: 0,
      comments: 0,
      downloads: 0,
      rating: 0,
      uploadDate: new Date(),
      likedBy: []
    };
    this.notes.unshift(newNote);
    return newNote;
  }

  likeNote(noteId: string, userId: string): boolean {
    const note = this.notes.find(n => n.id === noteId);
    if (!note) return false;

    const hasLiked = note.likedBy.includes(userId);
    if (hasLiked) {
      note.likedBy = note.likedBy.filter(id => id !== userId);
      note.likes--;
    } else {
      note.likedBy.push(userId);
      note.likes++;
    }
    return !hasLiked;
  }

  downloadNote(noteId: string): boolean {
    const note = this.notes.find(n => n.id === noteId);
    if (note) {
      note.downloads++;
      return true;
    }
    return false;
  }

  // Questions methods
  getAllQuestions(): Question[] {
    return this.questions;
  }

  getQuestionById(id: string): Question | undefined {
    return this.questions.find(question => question.id === id);
  }

  searchQuestions(query: string, filters: {
    class?: string;
    subject?: string;
    year?: string;
    school?: string;
  }): Question[] {
    let filtered = this.questions;

    if (query) {
      filtered = filtered.filter(question =>
        question.title.toLowerCase().includes(query.toLowerCase()) ||
        question.school.toLowerCase().includes(query.toLowerCase()) ||
        question.uploader.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filters.class) {
      filtered = filtered.filter(question => question.class === filters.class);
    }

    if (filters.subject) {
      filtered = filtered.filter(question => question.subject === filters.subject);
    }

    if (filters.year) {
      filtered = filtered.filter(question => question.year.toString() === filters.year);
    }

    if (filters.school) {
      filtered = filtered.filter(question => question.school === filters.school);
    }

    return filtered.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());
  }

  uploadQuestion(questionData: Omit<Question, 'id' | 'views' | 'likes' | 'answers' | 'uploadDate' | 'likedBy'>): Question {
    const newQuestion: Question = {
      ...questionData,
      id: Date.now().toString(),
      views: 0,
      likes: 0,
      answers: 0,
      uploadDate: new Date(),
      likedBy: []
    };
    this.questions.unshift(newQuestion);
    return newQuestion;
  }

  likeQuestion(questionId: string, userId: string): boolean {
    const question = this.questions.find(q => q.id === questionId);
    if (!question) return false;

    const hasLiked = question.likedBy.includes(userId);
    if (hasLiked) {
      question.likedBy = question.likedBy.filter(id => id !== userId);
      question.likes--;
    } else {
      question.likedBy.push(userId);
      question.likes++;
    }
    return !hasLiked;
  }

  viewQuestion(questionId: string): boolean {
    const question = this.questions.find(q => q.id === questionId);
    if (question) {
      question.views++;
      return true;
    }
    return false;
  }
}

export const notesService = new NotesService();
