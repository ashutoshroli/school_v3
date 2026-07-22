'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  GraduationCap,
  Calendar,
  DollarSign,
  FileText,
  Bus,
  Building,
  Settings,
  ChevronLeft,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Students', href: '/students' },
  { icon: GraduationCap, label: 'Staff', href: '/staff' },
  { icon: Calendar, label: 'Attendance', href: '/attendance' },
  { icon: FileText, label: 'Exams', href: '/exams' },
  { icon: DollarSign, label: 'Fees', href: '/fees' },
  { icon: FileText, label: 'Leave', href: '/leave' },
  { icon: Bus, label: 'Transport', href: '/transport' },
  { icon: Building, label: 'Rooms', href: '/rooms' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const handleLogout = () => {
    useAuthStore.getState().logout();
    window.location.href = '/login';
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-secondary-900 text-white transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-secondary-800 px-4">
        {!isCollapsed && (
          <Link href="/dashboard" className="text-xl font-bold">
            School ERP
          </Link>
        )}
        <button
          onClick={onToggle}
          className={cn(
            'rounded-lg p-2 hover:bg-secondary-800 transition-colors',
            isCollapsed && 'mx-auto'
          )}
        >
          <ChevronLeft
            className={cn('h-5 w-5 transition-transform', isCollapsed && 'rotate-180')}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-secondary-300 hover:bg-secondary-800 hover:text-white',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-secondary-800 p-4">
        <div
          className={cn(
            'flex items-center gap-3',
            isCollapsed && 'justify-center'
          )}
        >
          <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-sm font-medium">
            {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.fullName || user?.username}</p>
              <p className="text-xs text-secondary-400 capitalize">{user?.role}</p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="rounded-lg p-2 hover:bg-secondary-800 text-secondary-400 hover:text-white"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
