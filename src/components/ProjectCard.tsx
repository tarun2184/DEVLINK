

import { motion } from 'framer-motion';
import { MapPinIcon } from 'lucide-react';
import { Project } from '../types';
import { useAppStore } from '../store/AppStore';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const { getDeveloper } = useAppStore();
  const dev = getDeveloper(project.developerId);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
      
      <div className="aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
            {project.category}
          </span>
          {project.price !== undefined && project.price > 0 && (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
              ${project.price.toLocaleString()}
            </span>
          )}
          <span className="text-xs text-slate-400">{project.createdAt}</span>
        </div>
        <h3 className="text-base font-semibold text-slate-900">
          {project.title}
        </h3>
        <p className="line-clamp-2 text-sm text-slate-600">{project.summary}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {project.tags.slice(0, 3).map((tag) =>
          <span
            key={tag}
            className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            
              {tag}
            </span>
          )}
          {project.demoUrl && (
            <span className="rounded-md bg-indigo-50/80 border border-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700">
              Demo Live
            </span>
          )}
        </div>
        {dev &&
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
            <img
            src={dev.avatarUrl}
            alt={dev.name}
            className="h-7 w-7 rounded-full object-cover" />
          
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">
                {dev.name}
              </p>
              <p className="flex items-center gap-1 truncate text-xs text-slate-500">
                <MapPinIcon className="h-3 w-3" />
                {dev.location}
              </p>
            </div>
          </div>
        }
      </div>
    </motion.button>);

}