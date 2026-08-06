import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, MapPinIcon, MailIcon, DollarSignIcon, SendIcon, CheckCircle2Icon, BriefcaseIcon } from 'lucide-react';
import { useAppStore } from '../store/AppStore';
import { ProjectCard } from '../components/ProjectCard';

export function DeveloperProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDeveloper, projects, sendMessage } = useAppStore();

  const developer = getDeveloper(id || '');
  const developerProjects = projects.filter((p) => p.developerId === id);

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [budget, setBudget] = useState('$5k - $10k');
  const [body, setBody] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!developer) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-xl font-bold text-slate-900">Developer not found</h2>
        <button
          onClick={() => navigate('/client')}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to project directory
        </button>
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !body.trim()) return;

    sendMessage({
      projectId: developerProjects[0]?.id || 'general',
      developerId: developer.id,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      budget,
      body: body.trim()
    });

    setSentSuccess(true);
    setBody('');
  };

  return (
    <div className="space-y-8">
      <button
        onClick={() => navigate('/client')}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeftIcon className="h-4 w-4" />
        Back to projects
      </button>

      {/* Developer Header Banner */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <img
              src={developer.avatarUrl}
              alt={developer.name}
              className="h-20 w-20 rounded-2xl object-cover ring-4 ring-slate-100 shadow-sm"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {developer.name}
                </h1>
                {developer.username && (
                  <span className="text-base font-medium text-slate-500">
                    @{developer.username}
                  </span>
                )}
              </div>
              <p className="text-base font-medium text-slate-600 mt-1">{developer.title}</p>
              {developer.bio && (
                <p className="mt-2 text-sm text-slate-600 max-w-xl">{developer.bio}</p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
                  <MapPinIcon className="h-3.5 w-3.5 text-slate-400" />
                  {developer.location}
                </span>
                {developer.currentCity && (
                  <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
                    <span className="font-semibold">City:</span> {developer.currentCity}
                  </span>
                )}
                {developer.qualification && (
                  <span className="flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-md text-indigo-700 border border-indigo-100">
                    <span className="font-semibold">Degree:</span> {developer.qualification}
                  </span>
                )}
                {developer.experience && (
                  <span className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-md text-amber-700 border border-amber-100">
                    <span className="font-semibold">Exp:</span> {developer.experience}
                  </span>
                )}
                <span className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md text-emerald-700 border border-emerald-200">
                  <DollarSignIcon className="h-3.5 w-3.5 text-emerald-500" />
                  ₹{developer.hourlyRate.toLocaleString()}/hr
                </span>
                <span className="flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-md text-indigo-700 border border-indigo-200">
                  <BriefcaseIcon className="h-3.5 w-3.5 text-indigo-500" />
                  {developerProjects.length} Published Projects
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Developer Projects Column */}
        <div className="space-y-6 lg:col-span-2">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Portfolio Showcase ({developerProjects.length})
          </h2>

          {developerProjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
              No published projects yet for this developer.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {developerProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => navigate(`/client/project/${project.id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Contact Form Column */}
        <div>
          <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MailIcon className="h-5 w-5 text-indigo-600" />
              Contact {developer.name.split(' ')[0]}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Send a direct project inquiry or hiring proposal.
            </p>

            {sentSuccess ? (
              <div className="mt-5 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
                <CheckCircle2Icon className="mx-auto h-8 w-8 text-emerald-600 mb-2" />
                <h4 className="font-semibold text-emerald-900 text-sm">Message Sent!</h4>
                <p className="mt-1 text-xs text-emerald-700">
                  Your message has been delivered to {developer.name}. They will respond to your email.
                </p>
                <button
                  type="button"
                  onClick={() => setSentSuccess(false)}
                  className="mt-3 text-xs font-semibold text-emerald-800 underline">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="mt-5 space-y-4">
                <label className="block">
                  <span className="block text-xs font-medium text-slate-700 mb-1">Your Name</span>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </label>

                <label className="block">
                  <span className="block text-xs font-medium text-slate-700 mb-1">Your Email</span>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </label>

                <label className="block">
                  <span className="block text-xs font-medium text-slate-700 mb-1">Estimated Budget</span>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20">
                    <option value="< $2,000">&lt; $2,000</option>
                    <option value="$2,000 - $5,000">$2,000 - $5,000</option>
                    <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                    <option value="$10,000+">$10,000+</option>
                  </select>
                </label>

                <label className="block">
                  <span className="block text-xs font-medium text-slate-700 mb-1">Project Details</span>
                  <textarea
                    required
                    rows={4}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Describe your project, timeline, and deliverables..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none"
                  />
                </label>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
                  <SendIcon className="h-4 w-4" />
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
