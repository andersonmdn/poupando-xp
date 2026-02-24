'use client';

import { Brand } from '@/components/ui/Brand';
import { Bell, Cog, Search } from '@/components/ui/icons';
import { useAuth } from '@/contexts/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Accounts', href: '/accounts' },
  { label: 'Transactions', href: '/transactions' },
  { label: 'Budgets', href: '/budgets' },
  { label: 'Reports', href: '/reports' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const userName = user?.name || 'Usuário';
  const userData = user as
    | (typeof user & {
        planName?: string;
        avatarUrl?: string;
      })
    | null;
  const userPlan = userData?.planName || 'Plano Premium';
  const avatarUrl = userData?.avatarUrl || '';
  const userInitials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(name => name[0]?.toUpperCase())
    .join('');

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="w-72 shrink-0 bg-slate-900 px-6 py-6 text-white">
        <div className="flex h-full flex-col">
          <Brand
            className="flex items-center"
            nameClassName="px-3 py-2 text-lg font-semibold text-white"
            iconWrapperClassName="flex h-10 w-10 items-center justify-center rounded-md bg-blue-500"
          />

          <nav className="mt-8">
            <ul className="space-y-1">
              {menuItems.map(item => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' &&
                    pathname.startsWith(item.href + '/'));

                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`block rounded-lg px-3 py-2 text-sm transition ${
                        isActive
                          ? 'bg-slate-800 font-medium text-white'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto pt-6">
            <Link
              href="/transactions/new"
              className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-400"
            >
              + Add Transaction
            </Link>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between gap-6 border-b border-slate-200 bg-white px-8 py-4">
          <div className="w-2/5 min-w-[320px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none focus:border-slate-300 focus:bg-white"
              />
            </label>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50"
              aria-label="Notificações"
            >
              <Bell className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50"
              aria-label="Configurações"
            >
              <Cog className="h-5 w-5" />
            </button>

            <div className="ml-2 flex items-center gap-3">
              <div className="text-right leading-tight">
                <p className="text-sm font-semibold text-slate-900">
                  {userName}
                </p>
                <p className="text-xs text-slate-500">{userPlan}</p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={userName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  userInitials || 'U'
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
