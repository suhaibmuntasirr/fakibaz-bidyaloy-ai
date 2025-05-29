
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
  authorId: string;
  authorName: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  likes: number;
  likedBy: string[];
  downloads: number;
  downloadedBy: string[];
  comments: number;
  rating: number;
  ratingCount: number;
  verified: boolean;
  tags: string[];
  uploaderName: string;
}
