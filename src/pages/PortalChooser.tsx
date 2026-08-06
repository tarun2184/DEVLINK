

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  CodeXmlIcon,
  SearchIcon,
  UploadCloudIcon } from
'lucide-react';
import { useAppStore } from '../store/AppStore';
import { Role } from '../types';

export function PortalChooser() {
  const { setRole } = useAppStore();
  const navigate = useNavigate();

  const choose = (role: Role) => {
    setRole(role);
    navigate(role === 'client' ? '/client' : '/developer');
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div className="mb-10 flex flex-col items-center text-center">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <CodeXmlIcon className="h-7 w-7" />
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          DevLink
        </h1>
        <p className="mt-3 max-w-md text-slate-600">
          Where developers showcase their work and clients find the right person
          to build their next project.
        </p>
      </div>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
        <PortalCard
          icon={<SearchIcon className="h-6 w-6" />}
          title="I'm a Client"
          description="Browse developer projects, filter by skill, and reach out to the right developer for your idea."
          cta="Enter client portal"
          onClick={() => choose('client')} />
        
        <PortalCard
          icon={<UploadCloudIcon className="h-6 w-6" />}
          title="I'm a Developer"
          description="Upload your projects, build your portfolio, and receive messages from interested clients."
          cta="Enter developer portal"
          onClick={() => choose('developer')}
          accent />
        
      </div>
    </div>);

}

interface PortalCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
  accent?: boolean;
}

function PortalCard({
  icon,
  title,
  description,
  cta,
  onClick,
  accent
}: PortalCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`group flex flex-col items-start gap-4 rounded-2xl border p-7 text-left shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
      accent ?
      'border-indigo-200 bg-indigo-600 text-white' :
      'border-slate-200 bg-white'}`
      }>
      
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
        accent ? 'bg-white/15 text-white' : 'bg-indigo-50 text-indigo-600'}`
        }>
        
        {icon}
      </span>
      <div>
        <h2
          className={`text-xl font-bold ${
          accent ? 'text-white' : 'text-slate-900'}`
          }>
          
          {title}
        </h2>
        <p
          className={`mt-1.5 text-sm ${
          accent ? 'text-indigo-100' : 'text-slate-600'}`
          }>
          
          {description}
        </p>
      </div>
      <span
        className={`mt-auto inline-flex items-center gap-1.5 text-sm font-semibold ${
        accent ? 'text-white' : 'text-indigo-600'}`
        }>
        
        {cta}
        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </motion.button>);

}