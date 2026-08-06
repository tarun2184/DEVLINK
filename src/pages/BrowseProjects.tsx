


import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, FrownIcon } from 'lucide-react';
import { ProjectCard } from '../components/ProjectCard';
import { useAppStore } from '../store/AppStore';
import { CATEGORIES } from '../data/seed';

export function BrowseProjects() {
  const { projects } = useAppStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category;
      const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [projects, query, category]);

  const filters = ['All', ...CATEGORIES];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Find a developer
        </h1>
        <p className="mt-1 text-slate-600">
          Browse {projects.length} projects and reach out to the developers
          behind them.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, skills, or tech…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
          
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) =>
          <button
            key={f}
            onClick={() => setCategory(f)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
            category === f ?
            'bg-indigo-600 text-white' :
            'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`
            }>
            
              {f}
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ?
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <FrownIcon className="h-10 w-10 text-slate-300" />
          <p className="font-medium text-slate-700">No projects match</p>
          <p className="text-sm text-slate-500">
            Try a different search or category.
          </p>
        </div> :

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) =>
        <ProjectCard
          key={project.id}
          project={project}
          onClick={() => navigate(`/client/project/${project.id}`)} />

        )}
        </div>
      }
    </div>);

}