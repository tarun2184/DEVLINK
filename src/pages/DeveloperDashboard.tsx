import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderPlusIcon,
  InboxIcon,
  PlusIcon,
  Trash2Icon,
  HistoryIcon,
  ClockIcon,
  UploadIcon,
  MessageSquareIcon,
  UserCheckIcon,
  BriefcaseIcon
} from 'lucide-react';
import { useAppStore } from '../store/AppStore';
import { EditProfileModal } from '../components/EditProfileModal';
import { UserCogIcon } from 'lucide-react';
import { projects as seedProjects } from '../data/seed';

export function DeveloperDashboard() {
  const {
    currentDeveloper,
    setCurrentDeveloperId,
    developers,
    projects,
    addProject,
    deleteProject,
    messagesForDeveloper,
    activityLogs
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'messages' | 'history'>('overview');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(currentDeveloper.bio || '');
  const [bioSavedSuccess, setBioSavedSuccess] = useState(false);

  const handleSaveBio = () => {
    useAppStore.getState().updateCurrentDeveloper({ bio: bioInput.trim() });
    setBioSavedSuccess(true);
    setIsEditingBio(false);
    setTimeout(() => setBioSavedSuccess(false), 2000);
  };

  const myProjects = projects.filter(
    (p) => p.developerId === currentDeveloper.id
  );
  const inbox = messagesForDeveloper(currentDeveloper.id);

  return (
    <div className="space-y-6">
      {/* Profile Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={currentDeveloper.avatarUrl}
            alt={currentDeveloper.name}
            className="h-16 w-16 rounded-full object-cover ring-4 ring-slate-100 shadow-sm" />
          
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                {currentDeveloper.name}
              </h1>
              {currentDeveloper.username && (
                <span className="text-sm font-medium text-slate-500">
                  @{currentDeveloper.username}
                </span>
              )}
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200">
                Developer Account
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 mt-0.5">{currentDeveloper.title}</p>
            
            {/* Inline Bio Section with Save Bio Option */}
            <div className="mt-2 max-w-lg">
              {isEditingBio ? (
                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    placeholder="Enter your professional bio..."
                    className="w-full rounded-xl border border-indigo-300 p-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveBio}
                      className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors">
                      Save Bio
                    </button>
                    <button
                      onClick={() => setIsEditingBio(false)}
                      className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {currentDeveloper.bio || 'No bio set yet. Click Edit Bio to add one.'}
                  </p>
                  <button
                    onClick={() => {
                      setBioInput(currentDeveloper.bio || '');
                      setIsEditingBio(true);
                    }}
                    className="shrink-0 text-[11px] font-bold text-indigo-600 hover:underline">
                    Edit Bio
                  </button>
                </div>
              )}
              {bioSavedSuccess && (
                <p className="text-[11px] font-semibold text-emerald-600 mt-1 animate-fade-in">
                  ✓ Bio saved successfully!
                </p>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-500">
              {currentDeveloper.currentCity && (
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">City: {currentDeveloper.currentCity}</span>
              )}
              {currentDeveloper.qualification && (
                <span className="bg-indigo-50 px-2 py-0.5 rounded text-indigo-700 border border-indigo-100">Degree: {currentDeveloper.qualification}</span>
              )}
              {currentDeveloper.experience && (
                <span className="bg-amber-50 px-2 py-0.5 rounded text-amber-700 border border-amber-100">Exp: {currentDeveloper.experience}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Active Developer Profile Selector */}
          <select
            value={currentDeveloper.id}
            onChange={(e) => setCurrentDeveloperId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20">
            {developers.map((d) => (
              <option key={d.id} value={d.id}>
                Switch Profile: {d.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 shadow-sm">
            <UserCogIcon className="h-4 w-4 text-slate-600" />
            Edit Profile
          </button>
          <Link
            to="/developer/upload"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 shadow-sm">
            <PlusIcon className="h-4 w-4" />
            Upload project
          </Link>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Total Projects" value={myProjects.length} icon={BriefcaseIcon} />
        <Stat label="Client Messages" value={inbox.length} icon={InboxIcon} />
        <Stat label="Activity Events" value={activityLogs.length} icon={HistoryIcon} />
      </div>

      {/* Simple Navigation Tabs */}
      <div className="flex border-b border-slate-200 text-sm font-medium text-slate-600 gap-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition-colors ${
            activeTab === 'overview'
              ? 'border-b-2 border-indigo-600 font-bold text-indigo-600'
              : 'hover:text-slate-900'
          }`}>
          Overview
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-3 transition-colors ${
            activeTab === 'projects'
              ? 'border-b-2 border-indigo-600 font-bold text-indigo-600'
              : 'hover:text-slate-900'
          }`}>
          My Projects ({myProjects.length})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-3 transition-colors ${
            activeTab === 'messages'
              ? 'border-b-2 border-indigo-600 font-bold text-indigo-600'
              : 'hover:text-slate-900'
          }`}>
          Messages ({inbox.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 transition-colors ${
            activeTab === 'history'
              ? 'border-b-2 border-indigo-600 font-bold text-indigo-600'
              : 'hover:text-slate-900'
          }`}>
          History & Activity Log ({activityLogs.length})
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Messages Preview */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <InboxIcon className="h-5 w-5 text-indigo-600" />
                Recent Messages
              </h2>
              {inbox.length > 0 && (
                <button
                  onClick={() => setActiveTab('messages')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                  View all ({inbox.length}) →
                </button>
              )}
            </div>
            {inbox.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                No messages yet. When a client contacts you about a project, it shows up here.
              </div>
            ) : (
              <ul className="space-y-3">
                {inbox.slice(0, 3).map((m) => {
                  const project = projects.find((p) => p.id === m.projectId);
                  return (
                    <li key={m.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-slate-900">
                          {m.clientName}{' '}
                          <span className="font-normal text-slate-500">· {m.clientEmail}</span>
                        </p>
                        {m.budget && (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                            {m.budget}
                          </span>
                        )}
                      </div>
                      {project && (
                        <p className="mt-0.5 text-xs text-slate-400">Re: {project.title}</p>
                      )}
                      <p className="mt-2 text-sm text-slate-600">{m.body}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Projects Preview */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Portfolio Projects</h2>
              <button
                onClick={() => setActiveTab('projects')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                Manage projects ({myProjects.length}) →
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myProjects.slice(0, 3).map((project) => (
                <div key={project.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <img src={project.imageUrl} alt={project.title} className="aspect-video w-full object-cover" />
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-slate-900">{project.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">{project.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Tab 2: Projects */}
      {activeTab === 'projects' && (
        <section className="space-y-8">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">My Portfolio Projects</h2>
            {myProjects.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center">
                <FolderPlusIcon className="h-10 w-10 text-slate-300" />
                <p className="font-medium text-slate-700">No projects uploaded yet</p>
                <p className="text-xs text-slate-500 max-w-sm">
                  Create your own custom project or select one of the demo showcase templates below to instantly populate your dashboard.
                </p>
                <Link
                  to="/developer/upload"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
                  Upload Custom Project
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <img src={project.imageUrl} alt={project.title} className="aspect-video w-full object-cover" />
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">{project.title}</h3>
                          {project.price && (
                            <span className="inline-block mt-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                              ${project.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => deleteProject(project.id)}
                          aria-label={`Delete ${project.title}`}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600">
                          <Trash2Icon className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs text-slate-500">{project.summary}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 pt-8">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900">Demo Projects Showcase Templates</h2>
              <p className="text-xs text-slate-500 mt-0.5">Click "Import template" to populate your profile with real-world examples for demo purposes.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {seedProjects.map((project) => {
                const alreadyImported = myProjects.some(
                  (p) => p.title.toLowerCase() === project.title.toLowerCase()
                );
                return (
                  <div
                    key={project.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <img src={project.imageUrl} alt={project.title} className="aspect-video w-full object-cover" />
                      <div className="p-4">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                            {project.category}
                          </span>
                          {project.price && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                              ${project.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900">{project.title}</h3>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">{project.summary}</p>
                      </div>
                    </div>
                    
                    <div className="p-4 border-t border-slate-50 bg-slate-50/50 flex justify-end">
                      <button
                        onClick={() => {
                          if (!alreadyImported) {
                            addProject({
                              title: project.title,
                              summary: project.summary,
                              description: project.description,
                              category: project.category,
                              tags: project.tags,
                              imageUrl: project.imageUrl,
                              price: project.price
                            });
                          }
                        }}
                        disabled={alreadyImported}
                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors ${
                          alreadyImported
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}>
                        {alreadyImported ? 'Imported' : 'Import Template'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Tab 3: Messages */}
      {activeTab === 'messages' && (
        <section>
          {inbox.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
              No client messages received yet.
            </div>
          ) : (
            <ul className="space-y-3">
              {inbox.map((m) => {
                const project = projects.find((p) => p.id === m.projectId);
                return (
                  <li key={m.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-slate-900">
                        {m.clientName}{' '}
                        <span className="font-normal text-slate-500">· {m.clientEmail}</span>
                      </p>
                      {m.budget && (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                          {m.budget}
                        </span>
                      )}
                    </div>
                    {project && (
                      <p className="mt-0.5 text-xs text-slate-400">Re: {project.title}</p>
                    )}
                    <p className="mt-2 text-sm text-slate-600">{m.body}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      {/* Tab 4: Activity History Timeline */}
      {activeTab === 'history' && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HistoryIcon className="h-5 w-5 text-indigo-600" />
              Activity History Timeline
            </h2>
            <span className="text-xs text-slate-400 font-medium">Real-time log</span>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {activityLogs.map((log) => {
              let IconComponent = ClockIcon;
              let badgeColor = 'bg-slate-100 text-slate-700';

              if (log.type === 'project_uploaded') {
                IconComponent = UploadIcon;
                badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-200';
              } else if (log.type === 'message_received') {
                IconComponent = MessageSquareIcon;
                badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
              } else if (log.type === 'login') {
                IconComponent = UserCheckIcon;
                badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
              } else if (log.type === 'project_deleted') {
                IconComponent = Trash2Icon;
                badgeColor = 'bg-red-50 text-red-700 border-red-200';
              }

              return (
                <div key={log.id} className="relative flex items-start gap-4">
                  <div className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-4 ring-slate-100">
                    <IconComponent className="h-3.5 w-3.5 text-indigo-600" />
                  </div>
                  <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-slate-900">{log.title}</span>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${badgeColor}`}>
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">{log.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-2xl font-extrabold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
      </div>
      <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}