-- Supabase Schema for Developer Portfolio & Marketplace

-- 1. Create Developers Table
CREATE TABLE IF NOT EXISTS public.developers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    avatar_url TEXT NOT NULL,
    location TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    hourly_rate INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    developer_id TEXT NOT NULL REFERENCES public.developers(id) ON DELETE CASCADE,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 3. Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    developer_id TEXT NOT NULL REFERENCES public.developers(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    budget TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 6. Define Public RLS Policies
-- Allow public read access to developers and projects
CREATE POLICY "Allow public read developers" ON public.developers FOR SELECT USING (true);
CREATE POLICY "Allow public insert developers" ON public.developers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update developers" ON public.developers FOR UPDATE USING (true);

CREATE POLICY "Allow public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert projects" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete projects" ON public.projects FOR DELETE USING (true);

CREATE POLICY "Allow public read messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert messages" ON public.messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read activity_logs" ON public.activity_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert activity_logs" ON public.activity_logs FOR INSERT WITH CHECK (true);

-- 6. Insert Initial Seed Data
INSERT INTO public.developers (id, name, title, avatar_url, location, email, hourly_rate)
VALUES 
    ('dev-1', 'Ava Reyes', 'Full-stack Product Engineer', 'https://i.pravatar.cc/160?img=47', 'Bengaluru, IN', 'ava.reyes@example.com', 6500),
    ('dev-2', 'Marcus Cole', 'Mobile Engineer (iOS / Android)', 'https://i.pravatar.cc/160?img=12', 'Pune, IN', 'marcus.cole@example.com', 5500),
    ('dev-3', 'Lena Vogt', 'Frontend & Design Systems', 'https://i.pravatar.cc/160?img=32', 'Mumbai, IN', 'lena.vogt@example.com', 7200)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.projects (id, title, summary, description, image_url, category, tags, developer_id, created_at)
VALUES 
    ('proj-1', 'Pulse — Analytics Dashboard', 'A real-time SaaS analytics dashboard with custom charts and reports.', 'Pulse is a production analytics platform built with React and a Node backend. It features real-time data streaming, configurable dashboards, exportable reports, and role-based access. I designed the component system and shipped the full frontend.', '/546dab11-ff49-4d20-b1ea-cd11a9ea8b19.jpg', 'Web App', ARRAY['React', 'TypeScript', 'Charts', 'SaaS'], 'dev-1', '2026-06-02'),
    ('proj-2', 'FitTrack Mobile', 'Cross-platform fitness tracking app with workout plans and streaks.', 'FitTrack is a React Native fitness app with workout logging, streaks, social challenges, and Apple Health / Google Fit sync. I owned the mobile architecture and offline-first data layer.', '/301839fe-3515-4a99-bc4a-b950546eaaa0.jpg', 'Mobile', ARRAY['React Native', 'Health', 'Offline-first'], 'dev-2', '2026-05-18'),
    ('proj-3', 'Marketplace Storefront', 'Headless e-commerce storefront with fast checkout and search.', 'A headless commerce storefront built on a modern stack with instant search, optimized checkout, and a CMS-driven content layer. Improved conversion by 22% for the client.', '/77aed874-0afb-411f-8904-c08c2deeb3db.jpg', 'E-commerce', ARRAY['Commerce', 'Search', 'Performance'], 'dev-3', '2026-04-27'),
    ('proj-4', 'Aria — AI Assistant', 'Conversational AI assistant with streaming responses and tools.', 'Aria is an AI assistant product with streaming chat, tool calling, and a plugin system. I built the chat interface, streaming layer, and prompt tooling.', '/57e7a1bb-8fe8-4439-860a-81e45e95344a.jpg', 'AI / ML', ARRAY['AI', 'LLM', 'Streaming'], 'dev-1', '2026-06-20'),
    ('proj-5', 'Nova Brand System', 'Complete brand identity and design system for a startup.', 'Designed and built a cohesive brand identity plus a reusable design system with tokens, components, and documentation, shipped as a living style guide.', '/9f57eb27-1e83-4415-993e-929e471d6b5c.jpg', 'Branding', ARRAY['Design System', 'Branding', 'Tokens'], 'dev-3', '2026-03-14')
ON CONFLICT (id) DO NOTHING;
