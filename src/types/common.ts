
export interface ViewerItem {
  id: string;
  title: string;
  class: string;
  subject: string;
  authorName?: string;
  author?: string;
  createdAt?: Date;
  uploadDate?: Date;
  likes: number;
  downloads: number;
  comments: number;
  rating: number;
  fileUrl?: string;
  questionFileUrl?: string;
  answerFileUrl?: string;
  fileName: string;
  verified: boolean;
  likedBy: string[];
  tags: string[];
  description?: string;
}
