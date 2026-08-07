import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Developer, Message, Project } from '../types';

export const supabaseService = {
  async fetchDevelopers(): Promise<Developer[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    
    // We select from profiles table where role is developer
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'developer');
      
    if (error) {
      console.error('Error fetching developers from profiles table:', error);
      return null;
    }
    
    return data.map((d: any) => ({
      id: d.id,
      name: d.full_name || d.email.split('@')[0],
      title: 'Full-stack Developer',
      avatarUrl: d.avatar_url || `https://i.pravatar.cc/160?img=${Math.floor(Math.random() * 70)}`,
      location: 'Remote',
      email: d.email,
      hourlyRate: 6500
    }));
  },

  async fetchProjects(): Promise<Project[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching projects from Supabase:', error);
      return null;
    }
    
    return data.map((p: any) => ({
      id: p.id,
      title: p.title,
      summary: p.description || '',
      description: p.description || '',
      imageUrl: '/546dab11-ff49-4d20-b1ea-cd11a9ea8b19.jpg', // Default placeholder
      category: 'Web App',
      tags: [],
      developerId: p.developer_id,
      createdAt: p.created_at ? p.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10)
    }));
  },

  async fetchMessages(): Promise<Message[] | null> {
    // The database does not contain a messages table, so we handle it locally
    return null;
  },

  async addProject(project: Project): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase.from('projects').insert([{
      id: project.id,
      title: project.title,
      description: project.description,
      price: 0,
      developer_id: project.developerId,
      status: 'open'
    }]);
    if (error) {
      console.error('Error adding project to Supabase:', error);
      return false;
    }
    return true;
  },

  async deleteProject(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      console.error('Error deleting project from Supabase:', error);
      return false;
    }
    return true;
  },

  async sendMessage(message: Message): Promise<boolean> {
    // Return false so the store persists the message in localStorage (in-memory/demo layer)
    return false;
  },

  // Auth Methods
  async resetPassword(email: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured || !supabase) {
      return { error: 'Supabase is not configured' };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`
    });
    if (error) return { error: error.message };
    return { error: null };
  },

  async signUp(email: string, password: string): Promise<{ user: any; error: string | null }> {
    if (!isSupabaseConfigured || !supabase) {
      return { user: null, error: 'Supabase is not configured' };
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { user: null, error: error.message };
    
    // Create matching profiles row for the new user
    if (data.user) {
      try {
        await supabase.from('profiles').upsert([{
          id: data.user.id,
          email: data.user.email,
          full_name: email.split('@')[0],
          role: 'developer'
        }], { onConflict: 'id' });
      } catch (err) {
        console.warn('Profiles upsert note:', err);
      }
    }
    
    return { user: data.user, error: null };
  },

  async signIn(email: string, password: string): Promise<{ user: any; error: string | null }> {
    if (!isSupabaseConfigured || !supabase) {
      return { user: null, error: 'Supabase is not configured' };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { user: null, error: error.message };
    return { user: data.user, error: null };
  },

  async signOut(): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured || !supabase) return { error: null };
    const { error } = await supabase.auth.signOut();
    if (error) return { error: error.message };
    return { error: null };
  },

  async getUser(): Promise<any> {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!isSupabaseConfigured || !supabase) return () => {};
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return () => subscription.unsubscribe();
  },

  async updateDeveloper(developer: Partial<Developer> & { id: string }): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const updateObj: any = {};
    if (developer.name !== undefined) updateObj.full_name = developer.name;
    if (developer.avatarUrl !== undefined) updateObj.avatar_url = developer.avatarUrl;
    
    // Sync updates to profiles table
    const { error } = await supabase.from('profiles').update(updateObj).eq('id', developer.id);
    if (error) {
      console.error('Error updating developer in profiles table:', error);
      return false;
    }
    return true;
  }
};
