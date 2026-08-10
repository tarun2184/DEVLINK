import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, UploadCloudIcon, CheckCircle2Icon, BriefcaseIcon, DollarSignIcon } from 'lucide-react';
import { useAppStore } from '../store/AppStore';
import { Project } from '../types';
import { CATEGORIES } from '../data/seed';

interface EditProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditProjectModal({ project, isOpen, onClose }: EditProjectModalProps) {
  const { updateProject } = useAppStore();

  const [title, setTitle] = useState(project?.title || '');
  const [category, setCategory] = useState<string>(project?.category || CATEGORIES[0]);
  const [price, setPrice] = useState(project?.price ? project.price.toString() : '');
  const [summary, setSummary] = useState(project?.summary || '');
  const [description, setDescription] = useState(project?.description || '');
  const [imageUrl, setImageUrl] = useState(project?.imageUrl || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProject(project.id, {
      title: title.trim(),
      category,
      price: price ? parseFloat(price) : 0,
      summary: summary.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim() || project.imageUrl
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Edit Portfolio Project</h2>
              <p className="text-xs text-slate-500 mt-0.5">Modify details and publish updates live.</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          {savedSuccess ? (
            <div className="py-12 text-center">
              <CheckCircle2Icon className="mx-auto h-12 w-12 text-emerald-600 mb-3 animate-bounce" />
              <h3 className="text-lg font-bold text-slate-900">Project Published & Updated!</h3>
              <p className="text-xs text-slate-500 mt-1">Your changes are now live on your portfolio.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <label className="block">
                <span className="block text-xs font-medium text-slate-700 mb-1">Project Title</span>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="modal-field"
                />
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="block text-xs font-medium text-slate-700 mb-1">Category</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="modal-field">
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="block text-xs font-medium text-slate-700 mb-1">Project Price (₹)</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 50000"
                    className="modal-field"
                  />
                </label>
              </div>

              <label className="block">
                <span className="block text-xs font-medium text-slate-700 mb-1">Short Summary</span>
                <input
                  type="text"
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="modal-field"
                />
              </label>

              <label className="block">
                <span className="block text-xs font-medium text-slate-700 mb-1">Full Description</span>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="modal-field resize-none"
                />
              </label>

              <label className="block">
                <span className="block text-xs font-medium text-slate-700 mb-1">Cover Image URL</span>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="modal-field"
                />
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5">
                  <UploadCloudIcon className="h-4 w-4" />
                  Save & Publish Updated Project
                </button>
              </div>
            </form>
          )}

          <style>{`.modal-field{width:100%;border-radius:.75rem;border:1px solid #e2e8f0;padding:.55rem .75rem;font-size:.875rem;color:#0f172a;outline:none;background:#fff}.modal-field:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15)}`}</style>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
