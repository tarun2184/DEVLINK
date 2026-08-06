export type Role = 'client' | 'developer';

export interface Developer {
  id: string;
  name: string;
  username?: string;
  title: string;
  avatarUrl: string;
  location: string;
  email: string;
  hourlyRate: number;
  bio?: string;
  qualification?: string;
  experience?: string;
  currentCity?: string;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  developerId: string;
  createdAt: string;
  price?: number;
  demoUrl?: string;
  githubUrl?: string;
  timeline?: string;
}

export interface Message {
  id: string;
  projectId: string;
  developerId: string;
  clientName: string;
  clientEmail: string;
  budget?: string;
  body: string;
  senderRole?: 'client' | 'developer';
  status?: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  type: 'project_uploaded' | 'message_received' | 'project_deleted' | 'login';
  title: string;
  description: string;
  createdAt: string;
}