export interface ViewerItem {
  id: string;
  title: string;
  class: string;
  subject: string;
  chapter: string;
  authorName?: string;
  author: string;
  authorId: string;
  createdAt?: Date;
  uploadDate: Date;
  likes: number;
  downloads: number;
  comments: number;
  rating: number;
  fileUrl: string;
  questionFileUrl?: string;
  answerFileUrl?: string;
  fileName: string;
  fileSize: number;
  verified: boolean;
  likedBy: string[];
  tags: string[];
  description?: string;
}

export interface Note {
  id: string;
  title: string;
  class: string;
  subject: string;
  chapter: string;
  description: string;
  author: string;
  authorId: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  likes: number;
  likedBy: string[];
  downloads: number;
  comments: number;
  rating: number;
  verified: boolean;
  tags: string[];
}

export interface Question {
  id: string;
  title: string;
  subject: string;
  class: string;
  school: string;
  district: string;
  year: number;
  examType: string;
  duration: string;
  marks: number;
  downloadUrl: string;
  fileUrl: string;
  questionFileUrl?: string;
  fileName: string;
  fileSize: number;
  author: string;
  authorId: string;
  uploadDate: Date;
  likes: number;
  likedBy: string[];
  downloads: number;
  comments: number;
  rating: number;
  verified: boolean;
  tags: string[];
}
