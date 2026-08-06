



import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  MailIcon,
  MapPinIcon,
  WalletIcon } from
'lucide-react';
import { useAppStore } from '../store/AppStore';
import { ContactModal } from '../components/ContactModal';

export function ProjectDetail() {
  const { id } = useParams<{id: string;}>();
  const navigate = useNavigate();
  const { getProject, getDeveloper } = useAppStore();
  const [contactOpen, setContactOpen] = useState(false);

  const project = id ? getProject(id) : undefined;
  const developer = project 
    ? (getDeveloper(project.developerId) || {
        id: project.developerId,
        name: 'DevLink Partner',
        title: 'Full-stack Developer',
        avatarUrl: `https://i.pravatar.cc/160?img=47`,
        location: 'Remote',
        email: 'support@devlink.com',
        hourlyRate: 6500,
        bio: 'DevLink verified partner developer profile.'
      })
    : undefined;

  if (!project || !developer) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="text-lg font-semibold text-slate-900">
          Project not found
        </p>
        <Link
          to="/client"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          
          Back to browse
        </Link>
      </div>);

  }

  return (
    <div>
      <button
        onClick={() => navigate('/client')}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
        
        <ArrowLeftIcon className="h-4 w-4" />
        Back to browse
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="aspect-video w-full object-cover" />
            
          </div>
          <div className="mt-6">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                {project.category}
              </span>
              {project.price !== undefined && project.price > 0 && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
                  Budget: ${project.price.toLocaleString()}
                </span>
              )}
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
              {project.title}
            </h1>
            <p className="mt-3 leading-relaxed text-slate-600">
              {project.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((tag) =>
              <span
                key={tag}
                className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                
                  {tag}
                </span>
              )}
            </div>

            {/* Project Scope & Links */}
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
              {project.timeline && (
                <span className="inline-flex items-center text-xs font-semibold text-slate-700 bg-slate-100/70 border border-slate-200 px-3 py-1.5 rounded-xl">
                  Timeline: {project.timeline}
                </span>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl transition-colors">
                  Live Demo →
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl transition-colors">
                  GitHub Repo
                </a>
              )}
            </div>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <Link to={`/client/developer/${developer.id}`}>
                <img
                  src={developer.avatarUrl}
                  alt={developer.name}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-indigo-100 hover:opacity-90 transition-opacity" />
              </Link>
              <div>
                <Link to={`/client/developer/${developer.id}`} className="text-base font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                  {developer.name}
                </Link>
                <p className="text-sm text-slate-500">{developer.title}</p>
              </div>
            </div>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPinIcon className="h-4 w-4 text-slate-400" />
                {developer.location}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <WalletIcon className="h-4 w-4 text-slate-400" />
                ₹{developer.hourlyRate.toLocaleString('en-IN')}/hr
              </div>
              <div className="pt-1">
                <Link to={`/client/developer/${developer.id}`} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                  View full profile & portfolio →
                </Link>
              </div>
            </dl>

            <button
              onClick={() => setContactOpen(true)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
              
              <MailIcon className="h-4 w-4" />
              Contact developer
            </button>
            <p className="mt-3 text-center text-xs text-slate-400">
              Usually responds within a day
            </p>
          </div>
        </aside>
      </div>

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        project={project}
        developer={developer} />
      
    </div>);

}