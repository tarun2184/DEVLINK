import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CodeXmlIcon, LogOutIcon, RepeatIcon, UserCogIcon, SunIcon, MoonIcon } from 'lucide-react';
import { useAppStore } from '../store/AppStore';
import { EditProfileModal } from './EditProfileModal';

export function Header() {
  const { role, setRole, logout, currentDeveloper } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isClient = role === 'client';
  const homePath = isClient ? '/client' : '/developer';

  const clientNav = [
    { label: 'Browse', to: '/client' },
    { label: 'Client Inbox', to: '/client/inbox' }
  ];
  const devNav = [
    { label: 'Dashboard', to: '/developer' },
    { label: 'Developer Inbox', to: '/developer/inbox' },
    { label: 'Upload', to: '/developer/upload' }
  ];

  const nav = isClient ? clientNav : devNav;

  const switchPortal = () => {
    const next = isClient ? 'developer' : 'client';
    setRole(next);
    navigate(next === 'client' ? '/client' : '/developer');
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to={homePath} className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <CodeXmlIcon className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              DevLink
            </span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {nav.map((item) => {
              const active =
                location.pathname === item.to ||
                (item.to !== homePath && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:inline">
              {isClient ? 'Client' : 'Developer'}
            </span>

            {/* Edit Profile Button */}
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 shadow-sm"
              title="Edit Profile">
              {currentDeveloper?.avatarUrl ? (
                <img
                  src={currentDeveloper.avatarUrl}
                  alt={currentDeveloper.name}
                  className="h-5 w-5 rounded-full object-cover ring-1 ring-slate-200"
                />
              ) : (
                <UserCogIcon className="h-4 w-4 text-slate-500" />
              )}
              <span className="hidden sm:inline font-semibold">Edit Profile</span>
            </button>

            <button
              onClick={switchPortal}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
              <RepeatIcon className="h-4 w-4" />
              <span className="hidden sm:inline">
                Switch to {isClient ? 'Developer' : 'Client'}
              </span>
              <span className="sm:hidden">Switch</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Toggle theme"
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800">
              {theme === 'dark' ? (
                <SunIcon className="h-4 w-4 text-amber-400" />
              ) : (
                <MoonIcon className="h-4 w-4 text-slate-500" />
              )}
            </button>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              aria-label="Sign out"
              title="Sign out"
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800">
              <LogOutIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </>
  );
}