

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2Icon, XIcon } from 'lucide-react';
import { Developer, Project } from '../types';
import { useAppStore } from '../store/AppStore';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  project: Project;
  developer: Developer;
}

export function ContactModal({
  open,
  onClose,
  project,
  developer
}: ContactModalProps) {
  const { sendMessage } = useAppStore();
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [budget, setBudget] = useState('');
  const [body, setBody] = useState('');
  const [sent, setSent] = useState(false);

  const reset = () => {
    setClientName('');
    setClientEmail('');
    setBudget('');
    setBody('');
    setSent(false);
  };

  const close = () => {
    onClose();
    // Delay reset so the exit animation stays clean.
    setTimeout(reset, 250);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({
      projectId: project.id,
      developerId: developer.id,
      clientName,
      clientEmail,
      budget,
      body
    });
    setSent(true);
  };

  const canSubmit =
  clientName.trim() && clientEmail.trim() && body.trim().length > 4;

  return (
    <AnimatePresence>
      {open &&
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}>
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Contact ${developer.name}`}
          className="w-full max-w-lg overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}>
          
            <div className="flex items-start justify-between border-b border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <img
                src={developer.avatarUrl}
                alt={developer.name}
                className="h-10 w-10 rounded-full object-cover" />
              
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Contact {developer.name}
                  </h2>
                  <p className="text-sm text-slate-500">
                    About “{project.title}”
                  </p>
                </div>
              </div>
              <button
              onClick={close}
              aria-label="Close"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {sent ?
          <div className="flex flex-col items-center gap-3 p-8 text-center">
                <CheckCircle2Icon className="h-12 w-12 text-green-500" />
                <h3 className="text-lg font-semibold text-slate-900">
                  Message sent
                </h3>
                <p className="max-w-sm text-sm text-slate-600">
                  {developer.name} will get your message and reply to{' '}
                  <span className="font-medium text-slate-800">
                    {clientEmail}
                  </span>
                  .
                </p>
                <button
              onClick={close}
              className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
              
                  Done
                </button>
              </div> :

          <form onSubmit={handleSubmit} className="space-y-4 p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Your name">
                    <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                  className="input"
                  placeholder="Jane Doe" />
                
                  </Field>
                  <Field label="Email">
                    <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  required
                  className="input"
                  placeholder="jane@company.com" />
                
                  </Field>
                </div>
                <Field label="Budget (optional)">
                  <input
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="input"
                placeholder="e.g. ₹50,000 – ₹1,00,000" />
              
                </Field>
                <Field label="Message">
                  <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={4}
                className="input resize-none"
                placeholder="Tell them about your project and timeline…" />
              
                </Field>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                type="button"
                onClick={close}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                
                    Cancel
                  </button>
                  <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300">
                
                    Send message
                  </button>
                </div>
              </form>
          }
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}

function Field({
  label,
  children



}: {label: string;children: React.ReactNode;}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {children}
      <style>{`.input{width:100%;border-radius:0.5rem;border:1px solid #e2e8f0;padding:0.55rem 0.75rem;font-size:0.875rem;color:#0f172a;outline:none}.input:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,0.15)}`}</style>
    </label>);

}