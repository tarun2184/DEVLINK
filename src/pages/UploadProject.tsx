import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ImageIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import { useAppStore } from '../store/AppStore';
import { CATEGORIES } from '../data/seed';

const PLACEHOLDER = "/9f57eb27-1e83-4415-993e-929e471d6b5c.jpg";

export function UploadProject() {
  const { addProject } = useAppStore();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [fileFileName, setFileFileName] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [price, setPrice] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t) && tags.length < 6) {
      setTags((prev) => [...prev, t]);
    }
    setTagInput('');
  };

  const handleTagKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const canSubmit = title.trim() && summary.trim() && description.trim() && price.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    addProject({
      title: title.trim(),
      summary: summary.trim(),
      description: description.trim(),
      category,
      tags,
      imageUrl: imageUrl.trim() || PLACEHOLDER,
      price: price ? parseFloat(price) : 0
    });
    navigate('/developer');
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300">
          <UploadCloudIcon className="h-4 w-4" />
          Publish Project
        </button>
      </div>

      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
        Upload a project
      </h1>
      <p className="mt-1 text-slate-600">
        Add work to your portfolio so clients can discover and contact you.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <Field label="Project title" required>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="field"
            placeholder="e.g. Pulse — Analytics Dashboard" />
        </Field>

        <Field label="Category" required>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="field">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Project Price / Budget ($)" required>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            className="field"
            placeholder="e.g. 1500" />
        </Field>

        <Field label="Short summary" required>
          <input
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
            className="field"
            placeholder="One sentence shown on the project card" />
        </Field>

        <Field label="Description" required>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            className="field resize-none"
            placeholder="Describe the project, your role, and the outcome…" />
        </Field>

        {/* Media Upload Options */}
        <Field label="Project Media / Cover Image">
          <div className="space-y-3">
            {/* File Upload Dropzone */}
            <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-5 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 transition-all">
              <UploadCloudIcon className="h-8 w-8 text-indigo-600 mb-2" />
              <span className="text-sm font-semibold text-slate-800">
                {fileFileName ? `Selected: ${fileFileName}` : 'Upload local media image'}
              </span>
              <span className="text-xs text-slate-500 mt-0.5">
                PNG, JPG, WEBP up to 10MB
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Image Preview & URL Input */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 text-slate-400">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-5 w-5" />
                )}
              </div>
              <input
                value={imageUrl.startsWith('data:') ? '' : imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setFileFileName('');
                }}
                className="field"
                placeholder="Or paste an image URL (https://…)" />
            </div>
          </div>
        </Field>

        <Field label="Tags">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKey}
            onBlur={addTag}
            className="field"
            placeholder="Type a skill and press Enter (e.g. React)" />
          
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {t}
                  <button
                    type="button"
                    onClick={() =>
                      setTags((prev) => prev.filter((x) => x !== t))
                    }
                    aria-label={`Remove ${t}`}
                    className="text-slate-400 hover:text-slate-700">
                    <XIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </Field>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300">
            Publish project
          </button>
        </div>
      </form>

      <style>{`.field{width:100%;border-radius:0.5rem;border:1px solid #e2e8f0;padding:0.6rem 0.75rem;font-size:0.875rem;color:#0f172a;outline:none;background:#fff}.field:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,0.15)}`}</style>
    </div>
  );
}

function Field({
  label,
  required,
  children
}: {label: string; required?: boolean; children: React.ReactNode;}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-indigo-500"> *</span>}
      </span>
      {children}
    </label>
  );
}