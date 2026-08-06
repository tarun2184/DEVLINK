
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { SupabaseBanner } from './SupabaseBanner';
import { useAppStore } from '../store/AppStore';
import { Role } from '../types';

export function Layout({ requiredRole }: {requiredRole: Role;}) {
  const { role, setRole } = useAppStore();
  const navigate = useNavigate();

  // If the user deep-links into a portal without a role, adopt it.
  useEffect(() => {
    if (role !== requiredRole) {
      setRole(requiredRole);
    }
  }, [role, requiredRole, setRole]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 text-slate-900">
      <SupabaseBanner />
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 text-sm text-slate-500 sm:px-6">
          <span>© 2026 DevLink</span>
          <button
            onClick={() => {
              setRole(null);
              navigate('/');
            }}
            className="font-medium text-slate-500 hover:text-slate-800">
            
            Change portal
          </button>
        </div>
      </footer>
    </div>);

}