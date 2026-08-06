import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityLog, Developer, Message, Project, Role } from '../types';
import {
  developers as seedDevelopers,
  projects as seedProjects } from
 '../data/seed';
import { supabaseService } from '../services/supabaseService';
import { isSupabaseConfigured, checkSupabaseConnection } from '../lib/supabase';

interface AppUser {
  id?: string;
  name: string;
  email: string;
}

interface AppStoreValue {
  user: AppUser | null;
  login: (email: string) => void;
  signInWithSupabase: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithSupabase: (email: string, password: string) => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  logout: () => void;
  role: Role | null;
  setRole: (role: Role | null) => void;
  currentDeveloper: Developer;
  setCurrentDeveloperId: (id: string) => void;
  developers: Developer[];
  projects: Project[];
  messages: Message[];
  activityLogs: ActivityLog[];
  updateCurrentDeveloper: (updates: Partial<Developer>) => void;
  getDeveloper: (id: string) => Developer | undefined;
  getProject: (id: string) => Project | undefined;
  addProject: (
    input: Omit<Project, 'id' | 'developerId' | 'createdAt'>
  ) => Project;
  deleteProject: (id: string) => void;
  sendMessage: (input: Omit<Message, 'id' | 'createdAt'>) => Message;
  messagesForDeveloper: (developerId: string) => Message[];
  messagesForClient: (clientEmail: string) => Message[];
  isDemoMode: boolean;
  isCheckingConnection: boolean;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

const initialLogs: ActivityLog[] = [
  {
    id: 'act-1',
    type: 'login',
    title: 'Account Session Active',
    description: 'Signed in as developer.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'act-2',
    type: 'project_uploaded',
    title: 'Project Published',
    description: 'Published "Pulse — Analytics Dashboard" to portfolio.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

const initialMessages: Message[] = [
  {
    id: 'msg-1',
    projectId: 'proj-1',
    developerId: 'dev-1',
    clientName: 'Sarah Jenkins',
    clientEmail: 'sarah.j@acme.com',
    budget: '$5,000 - $10,000',
    body: 'Hi Ava, I loved your work on the Pulse Analytics Dashboard! We are building a similar SaaS product for healthcare metrics. Are you available for a 4-week engagement next month?',
    senderRole: 'client',
    status: 'replied',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
  },
  {
    id: 'msg-2',
    projectId: 'proj-1',
    developerId: 'dev-1',
    clientName: 'Sarah Jenkins',
    clientEmail: 'sarah.j@acme.com',
    body: 'Hello Sarah! Thank you for reaching out. Yes, I have open bandwidth starting next month. Could we schedule a 15-minute intro call to discuss your healthcare SaaS scope and design requirements?',
    senderRole: 'developer',
    status: 'read',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
  },
  {
    id: 'msg-3',
    projectId: 'proj-2',
    developerId: 'dev-2',
    clientName: 'David Miller',
    clientEmail: 'david.m@fitness.io',
    budget: '$10,000+',
    body: 'Hey Marcus, we are expanding our iOS fitness app and need an expert React Native engineer for Apple Health integration. Your FitTrack Mobile project looks amazing!',
    senderRole: 'client',
    status: 'unread',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

const getLocalStorageItem = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const setLocalStorageItem = <T,>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

export function AppStoreProvider({ children }: {children: React.ReactNode;}) {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(!isSupabaseConfigured);
  const [isCheckingConnection, setIsCheckingConnection] = useState<boolean>(isSupabaseConfigured);

  const [user, setUser] = useState<AppUser | null>(() => getLocalStorageItem<AppUser | null>('devlink_user', null));
  const [role, setRole] = useState<Role | null>(() => getLocalStorageItem<Role | null>('devlink_role', null));
  const [developers, setDevelopers] = useState<Developer[]>(() => getLocalStorageItem<Developer[]>('devlink_developers', seedDevelopers));
  const [projects, setProjects] = useState<Project[]>(() => getLocalStorageItem<Project[]>('devlink_projects', seedProjects));
  const [messages, setMessages] = useState<Message[]>(() => getLocalStorageItem<Message[]>('devlink_messages', initialMessages));
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => getLocalStorageItem<ActivityLog[]>('devlink_logs', initialLogs));

  const formatUserName = (email: string) => {
    const name = email.split('@')[0].replace(/[._-]/g, ' ');
    return name.replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const addLog = (type: ActivityLog['type'], title: string, description: string) => {
    const log: ActivityLog = {
      id: uid('act'),
      type,
      title,
      description,
      createdAt: new Date().toISOString()
    };
    setActivityLogs((prev) => [log, ...prev]);
  };

  useEffect(() => {
    async function initConnection() {
      if (!isSupabaseConfigured) {
        setIsDemoMode(true);
        setIsCheckingConnection(false);
        return;
      }

      setIsCheckingConnection(true);
      const healthy = await checkSupabaseConnection();
      setIsCheckingConnection(false);

      if (!healthy) {
        setIsDemoMode(true);
        console.warn('Falling back to Local Demo Mode.');
        return;
      }

      setIsDemoMode(false);

      // Fetch initial Supabase user
      supabaseService.getUser().then((sbUser) => {
        if (sbUser && sbUser.email) {
          const u = {
            id: sbUser.id,
            email: sbUser.email,
            name: formatUserName(sbUser.email)
          };
          setUser(u);
        }
      });

      // Subscribe to Auth changes
      const unsubscribe = supabaseService.onAuthStateChange((_event, session) => {
        if (session?.user?.email) {
          const u = {
            id: session.user.id,
            email: session.user.email,
            name: formatUserName(session.user.email)
          };
          setUser(u);
        } else {
          setUser(null);
        }
      });

      async function loadSupabaseData() {
        const [fetchedDevs, fetchedProjects, fetchedMessages] = await Promise.all([
          supabaseService.fetchDevelopers(),
          supabaseService.fetchProjects(),
          supabaseService.fetchMessages()
        ]);

        if (fetchedDevs && fetchedDevs.length > 0) {
          const mergedDevs = [...fetchedDevs];
          seedDevelopers.forEach(sd => {
            if (!mergedDevs.some(md => md.id === sd.id || md.email.toLowerCase() === sd.email.toLowerCase())) {
              mergedDevs.push(sd);
            }
          });
          setDevelopers(mergedDevs);
        } else {
          setDevelopers(seedDevelopers);
        }

        if (fetchedProjects && fetchedProjects.length > 0) {
          const mergedProj = [...fetchedProjects];
          seedProjects.forEach(sp => {
            if (!mergedProj.some(mp => mp.id === sp.id || mp.title.toLowerCase() === sp.title.toLowerCase())) {
              mergedProj.push(sp);
            }
          });
          setProjects(mergedProj);
        } else {
          setProjects(seedProjects);
        }

        if (fetchedMessages && fetchedMessages.length > 0) {
          setMessages(fetchedMessages);
        }
      }

      loadSupabaseData();
      return () => unsubscribe();
    }

    let unsubscribeFn: (() => void) | undefined;
    initConnection().then((unsub) => {
      if (unsub) unsubscribeFn = unsub;
    });

    return () => {
      if (unsubscribeFn) unsubscribeFn();
    };
  }, []);

  // Sync to localStorage in Demo Mode
  useEffect(() => {
    if (isDemoMode) {
      setLocalStorageItem('devlink_developers', developers);
    }
  }, [developers, isDemoMode]);

  useEffect(() => {
    if (isDemoMode) {
      setLocalStorageItem('devlink_projects', projects);
    }
  }, [projects, isDemoMode]);

  useEffect(() => {
    if (isDemoMode) {
      setLocalStorageItem('devlink_messages', messages);
    }
  }, [messages, isDemoMode]);

  useEffect(() => {
    if (isDemoMode) {
      setLocalStorageItem('devlink_logs', activityLogs);
    }
  }, [activityLogs, isDemoMode]);

  useEffect(() => {
    if (isDemoMode) {
      if (user) {
        setLocalStorageItem('devlink_user', user);
      } else {
        localStorage.removeItem('devlink_user');
      }
    }
  }, [user, isDemoMode]);

  useEffect(() => {
    if (isDemoMode) {
      if (role) {
        setLocalStorageItem('devlink_role', role);
      } else {
        localStorage.removeItem('devlink_role');
      }
    }
  }, [role, isDemoMode]);

  // Create default profile for developer users in Demo Mode if not exists
  useEffect(() => {
    if (isDemoMode && user && role === 'developer') {
      const exists = developers.some(d => d.email.toLowerCase() === user.email.toLowerCase());
      if (!exists) {
        const newDev: Developer = {
          id: user.id || uid('dev'),
          name: user.name,
          title: 'Full-stack Software Engineer',
          avatarUrl: `https://i.pravatar.cc/160?img=${Math.floor(Math.random() * 70)}`,
          location: 'Remote',
          email: user.email,
          hourlyRate: 6500
        };
        setDevelopers(prev => [...prev, newDev]);
        addLog('login', 'Profile Created', `Created developer profile for ${user.name}`);
      }
    }
  }, [user, role, isDemoMode]);

  const [currentDeveloperId, setCurrentDeveloperId] = useState<string>(seedDevelopers[0].id);

  // Set currentDeveloperId to matching developer profile when user logs in
  useEffect(() => {
    if (user && role === 'developer') {
      const devProfile = developers.find(d => d.email.toLowerCase() === user.email.toLowerCase());
      if (devProfile) {
        setCurrentDeveloperId(devProfile.id);
      }
    }
  }, [user, role, developers]);

  const currentDeveloper = useMemo(() => {
    return developers.find((d) => d.id === currentDeveloperId) || developers[0] || seedDevelopers[0];
  }, [developers, currentDeveloperId]);

  const value = useMemo<AppStoreValue>(() => {
    return {
      user,
      login: (email) => {
        const mockUser = {
          email,
          name: formatUserName(email)
        };
        setUser(mockUser);
        addLog('login', 'User Signed In', `Logged in as ${email}`);
      },
      signInWithSupabase: async (email, password) => {
        if (isDemoMode) {
          const mockUser = {
            id: uid('usr'),
            email,
            name: formatUserName(email)
          };
          setUser(mockUser);
          addLog('login', 'Demo Sign In', `Logged in as ${email} (Demo Mode)`);
          return { error: null };
        }

        const { user: sbUser, error } = await supabaseService.signIn(email, password);
        if (error) return { error };
        if (sbUser && sbUser.email) {
          setUser({
            id: sbUser.id,
            email: sbUser.email,
            name: formatUserName(sbUser.email)
          });
          addLog('login', 'Supabase Auth Sign In', `Authenticated via Supabase as ${sbUser.email}`);
        }
        return { error: null };
      },
      signUpWithSupabase: async (email, password) => {
        if (isDemoMode) {
          const mockUser = {
            id: uid('usr'),
            email,
            name: formatUserName(email)
          };
          setUser(mockUser);
          addLog('login', 'Demo Account Created', `Created account as ${email} (Demo Mode)`);
          return { error: null };
        }

        const { user: sbUser, error } = await supabaseService.signUp(email, password);
        if (error) return { error };
        if (sbUser && sbUser.email) {
          setUser({
            id: sbUser.id,
            email: sbUser.email,
            name: formatUserName(sbUser.email)
          });
          addLog('login', 'Supabase Account Created', `Created account as ${sbUser.email}`);
        }
        return { error: null };
      },
      resetPassword: async (email) => {
        if (isDemoMode) {
          addLog('login', 'Demo Password Reset', `Demo password reset requested for ${email}`);
          return { error: null };
        }
        return supabaseService.resetPassword(email);
      },
      logout: () => {
        if (!isDemoMode) {
          supabaseService.signOut();
        }
        setUser(null);
        setRole(null);
      },
      role,
      setRole,
      currentDeveloper,
      setCurrentDeveloperId,
      developers,
      projects,
      messages,
      activityLogs,
      updateCurrentDeveloper: (updates) => {
        setDevelopers((prev) =>
          prev.map((d) => (d.id === currentDeveloper.id ? { ...d, ...updates } : d))
        );
        if (!isDemoMode) {
          supabaseService.updateDeveloper({ id: currentDeveloper.id, ...updates });
        }
        addLog('login', 'Profile Updated', 'Updated profile photo, name, username, and bio.');
      },
      getDeveloper: (id) => developers.find((d) => d.id === id),
      getProject: (id) => projects.find((p) => p.id === id),
      addProject: (input) => {
        const project: Project = {
          ...input,
          id: uid('proj'),
          developerId: currentDeveloper.id,
          createdAt: new Date().toISOString().slice(0, 10)
        };
        setProjects((prev) => [project, ...prev]);
        if (!isDemoMode) {
          supabaseService.addProject(project);
        }
        addLog('project_uploaded', 'New Project Published', `Uploaded project "${project.title}"`);
        return project;
      },
      deleteProject: (id) => {
        const p = projects.find((proj) => proj.id === id);
        setProjects((prev) => prev.filter((p) => p.id !== id));
        if (!isDemoMode) {
          supabaseService.deleteProject(id);
        }
        if (p) {
          addLog('project_deleted', 'Project Removed', `Deleted project "${p.title}"`);
        }
      },
      sendMessage: (input) => {
        const message: Message = {
          ...input,
          senderRole: input.senderRole || 'client',
          status: 'unread',
          id: uid('msg'),
          createdAt: new Date().toISOString()
        };
        setMessages((prev) => [message, ...prev]);
        if (!isDemoMode) {
          supabaseService.sendMessage(message);
        }
        addLog('message_received', 'New Inquiry Received', `Message processed from ${input.clientName}`);
        return message;
      },
      messagesForDeveloper: (developerId) =>
        messages.filter((m) => m.developerId === developerId),
      messagesForClient: (clientEmail) =>
        messages.filter((m) => m.clientEmail.toLowerCase() === clientEmail.toLowerCase() || (user && user.email.toLowerCase() === clientEmail.toLowerCase())),
      isDemoMode,
      isCheckingConnection
    };
  }, [user, role, developers, projects, messages, activityLogs, currentDeveloper, currentDeveloperId, isDemoMode, isCheckingConnection]);

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) {
    throw new Error('useAppStore must be used within an AppStoreProvider');
  }
  return ctx;
}