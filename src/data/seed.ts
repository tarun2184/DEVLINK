import { Developer, Project } from '../types';

export const CATEGORIES = [
  'Web App',
  'Mobile',
  'E-commerce',
  'AI / ML',
  'Branding'
] as const;

export const developers: Developer[] = [
  {
    id: 'dev-1',
    name: 'Ava Reyes',
    title: 'Full-stack Product Engineer',
    avatarUrl: 'https://i.pravatar.cc/160?img=47',
    location: 'Bengaluru, IN',
    email: 'ava.reyes@example.com',
    hourlyRate: 6500,
    bio: 'Product-focused full-stack engineer with a passion for clean code, system architecture, and shipping intuitive user experiences. Expert in React, TypeScript, Node.js, and Postgres.',
    qualification: 'M.S. in Software Engineering',
    experience: '6 Years',
    currentCity: 'Bengaluru, IN'
  },
  {
    id: 'dev-2',
    name: 'Marcus Cole',
    title: 'Mobile Engineer (iOS / Android)',
    avatarUrl: 'https://i.pravatar.cc/160?img=12',
    location: 'Pune, IN',
    email: 'marcus.cole@example.com',
    hourlyRate: 5500,
    bio: 'Dedicated mobile developer specializing in building cross-platform native iOS & Android applications. Skilled in React Native, Swift, Kotlin, and offline-first databases.',
    qualification: 'B.E. in Computer Science',
    experience: '4 Years',
    currentCity: 'Pune, IN'
  },
  {
    id: 'dev-3',
    name: 'Lena Vogt',
    title: 'Frontend & Design Systems',
    avatarUrl: 'https://i.pravatar.cc/160?img=32',
    location: 'Mumbai, IN',
    email: 'lena.vogt@example.com',
    hourlyRate: 7200,
    bio: 'Frontend specialist focused on user interface excellence, accessibility (a11y), responsive design, and highly reusable design token-based component systems.',
    qualification: 'B.Tech in Information Technology',
    experience: '8 Years',
    currentCity: 'Mumbai, IN'
  }
];

export const projects: Project[] = [
  {
    id: 'proj-1',
    title: 'Pulse — Analytics Dashboard',
    summary: 'A real-time SaaS analytics dashboard with custom charts and reports.',
    description: 'Pulse is a production analytics platform built with React and a Node backend. It features real-time data streaming, configurable dashboards, exportable reports, and role-based access. I designed the component system and shipped the full frontend.',
    imageUrl: '/546dab11-ff49-4d20-b1ea-cd11a9ea8b19.jpg',
    category: 'Web App',
    tags: ['React', 'TypeScript', 'Charts', 'SaaS'],
    developerId: 'dev-1',
    createdAt: '2026-06-02',
    price: 1500,
    demoUrl: 'https://pulse-dashboard.demo.devlink.com',
    githubUrl: 'https://github.com/developer/pulse-dashboard',
    timeline: '4 Weeks'
  },
  {
    id: 'proj-2',
    title: 'FitTrack Mobile',
    summary: 'Cross-platform fitness tracking app with workout plans and streaks.',
    description: 'FitTrack is a React Native fitness app with workout logging, streaks, social challenges, and Apple Health / Google Fit sync. I owned the mobile architecture and offline-first data layer.',
    imageUrl: '/301839fe-3515-4a99-bc4a-b950546eaaa0.jpg',
    category: 'Mobile',
    tags: ['React Native', 'Health', 'Offline-first'],
    developerId: 'dev-2',
    createdAt: '2026-05-18',
    price: 2200,
    demoUrl: 'https://fittrack-app.demo.devlink.com',
    githubUrl: 'https://github.com/developer/fittrack-mobile',
    timeline: '6 Weeks'
  },
  {
    id: 'proj-3',
    title: 'Marketplace Storefront',
    summary: 'Headless e-commerce storefront with fast checkout and search.',
    description: 'A headless commerce storefront built on a modern stack with instant search, optimized checkout, and a CMS-driven content layer. Improved conversion by 22% for the client.',
    imageUrl: '/77aed874-0afb-411f-8904-c08c2deeb3db.jpg',
    category: 'E-commerce',
    tags: ['Commerce', 'Search', 'Performance'],
    developerId: 'dev-3',
    createdAt: '2026-04-27',
    price: 3500,
    demoUrl: 'https://nova-storefront.demo.devlink.com',
    githubUrl: 'https://github.com/developer/nova-commerce',
    timeline: '5 Weeks'
  },
  {
    id: 'proj-4',
    title: 'Aria — AI Assistant',
    summary: 'Conversational AI assistant with streaming responses and tools.',
    description: 'Aria is an AI assistant product with streaming chat, tool calling, and a plugin system. I built the chat interface, streaming layer, and prompt tooling.',
    imageUrl: '/57e7a1bb-8fe8-4439-860a-81e45e95344a.jpg',
    category: 'AI / ML',
    tags: ['AI', 'LLM', 'Streaming'],
    developerId: 'dev-1',
    createdAt: '2026-06-20',
    price: 1800,
    demoUrl: 'https://aria-ai.demo.devlink.com',
    githubUrl: 'https://github.com/developer/aria-assistant',
    timeline: '3 Weeks'
  },
  {
    id: 'proj-5',
    title: 'Nova Brand System',
    summary: 'Complete brand identity and design system for a startup.',
    description: 'Designed and built a cohesive brand identity plus a reusable design system with tokens, components, and documentation, shipped as a living style guide.',
    imageUrl: '/9f57eb27-1e83-4415-993e-929e471d6b5c.jpg',
    category: 'Branding',
    tags: ['Design System', 'Branding', 'Tokens'],
    developerId: 'dev-3',
    createdAt: '2026-03-14',
    price: 1200,
    demoUrl: 'https://nova-brand.demo.devlink.com',
    githubUrl: 'https://github.com/developer/nova-brand-system',
    timeline: '2 Weeks'
  }
];