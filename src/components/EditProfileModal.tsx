import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, UploadCloudIcon, UserIcon, AtSignIcon, MapPinIcon, BriefcaseIcon, DollarSignIcon, CheckCircle2Icon } from 'lucide-react';
import { useAppStore } from '../store/AppStore';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { currentDeveloper, updateCurrentDeveloper } = useAppStore();

  const [name, setName] = useState(currentDeveloper.name);
  const [username, setUsername] = useState(currentDeveloper.username || name.toLowerCase().replace(/\s+/g, ''));
  const [bio, setBio] = useState(currentDeveloper.bio || 'Full-stack software engineer passionate about building modern web applications.');
  const [title, setTitle] = useState(currentDeveloper.title);
  const [location, setLocation] = useState(currentDeveloper.location);
  const [hourlyRate, setHourlyRate] = useState(currentDeveloper.hourlyRate.toString());
  const [avatarUrl, setAvatarUrl] = useState(currentDeveloper.avatarUrl);
  const [qualification, setQualification] = useState(currentDeveloper.qualification || '');
  const [experience, setExperience] = useState(currentDeveloper.experience || '');
  const [currentCity, setCurrentCity] = useState(currentDeveloper.currentCity || '');
  const [fileName, setFileName] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentDeveloper({
      name: name.trim(),
      username: username.trim().replace(/^@/, ''),
      bio: bio.trim(),
      title: title.trim(),
      location: location.trim(),
      hourlyRate: parseInt(hourlyRate, 10) || currentDeveloper.hourlyRate,
      avatarUrl: avatarUrl.trim(),
      qualification: qualification.trim(),
      experience: experience.trim(),
      currentCity: currentCity.trim()
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
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Edit Profile</h2>
              <p className="text-xs text-slate-500 mt-0.5">Update your photo, username, bio, and details.</p>
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
              <h3 className="text-lg font-bold text-slate-900">Profile Updated Successfully!</h3>
              <p className="text-xs text-slate-500 mt-1">Your changes are now live across your profile and projects.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Profile Photo Upload Section */}
              <div className="flex items-center gap-4">
                <img
                  src={avatarUrl}
                  alt="Avatar Preview"
                  className="h-16 w-16 rounded-full object-cover ring-4 ring-indigo-50 shadow-sm"
                />
                <div className="flex-1">
                  <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
                    <UploadCloudIcon className="h-4 w-4 text-indigo-600" />
                    {fileName ? fileName : 'Upload Profile Photo'}
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                  <p className="text-[11px] text-slate-400 mt-1">JPG, PNG, or WEBP. Max 5MB.</p>
                </div>
              </div>

              {/* Full Name & Username */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="block text-xs font-medium text-slate-700 mb-1">Full Name</span>
                  <div className="relative">
                    <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="modal-field pl-9"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="block text-xs font-medium text-slate-700 mb-1">Username</span>
                  <div className="relative">
                    <AtSignIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="username"
                      className="modal-field pl-9"
                    />
                  </div>
                </label>
              </div>

              {/* Job Title & Location */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="block text-xs font-medium text-slate-700 mb-1">Title / Headline</span>
                  <div className="relative">
                    <BriefcaseIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="modal-field pl-9"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="block text-xs font-medium text-slate-700 mb-1">Location</span>
                  <div className="relative">
                    <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="modal-field pl-9"
                    />
                  </div>
                </label>
              </div>

              {/* Hourly Rate */}
              <label className="block">
                <span className="block text-xs font-medium text-slate-700 mb-1">Hourly Rate (₹)</span>
                <div className="relative">
                  <DollarSignIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    required
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="modal-field pl-9"
                  />
                </div>
              </label>

              {/* Qualification, Experience & Current City */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="block text-xs font-medium text-slate-700 mb-1">Qualification</span>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="e.g. B.Tech CS"
                    className="modal-field"
                  />
                </label>

                <label className="block">
                  <span className="block text-xs font-medium text-slate-700 mb-1">Experience</span>
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 5 Years"
                    className="modal-field"
                  />
                </label>

                <label className="block">
                  <span className="block text-xs font-medium text-slate-700 mb-1">Current City</span>
                  <input
                    type="text"
                    value={currentCity}
                    onChange={(e) => setCurrentCity(e.target.value)}
                    placeholder="e.g. Bangalore"
                    className="modal-field"
                  />
                </label>
              </div>

              {/* Bio */}
              <label className="block">
                <span className="block text-xs font-medium text-slate-700 mb-1">Bio / Profile Summary</span>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell clients about your skills, background, and work experience..."
                  className="modal-field resize-none"
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
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all">
                  Save Bio & Profile Changes
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
