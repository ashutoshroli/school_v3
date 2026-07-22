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
  BookOpen,
  Home as HostelIcon,
  UtensilsCrossed,
  ShoppingBag,
  FlaskConical,
  Package,
  UserPlus,
  ClipboardList,
  Wallet,
  Clock,
  Library,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: UserPlus, label: 'Admission', href: '/admission' },
  { icon: Users, label: 'Students', href: '/students' },
  { icon: GraduationCap, label: 'Staff', href: '/staff' },
  { icon: Calendar, label: 'Attendance', href: '/attendance' },
  { icon: FileText, label: 'Exams', href: '/exams' },
  { icon: DollarSign, label: 'Fees', href: '/fees' },
  { icon: Clock, label: 'Leave', href: '/leave' },
  { icon: ClipboardList, label: 'Homework', href: '/homework' },
  { icon: Wallet, label: 'Payroll', href: '/payroll' },
  { icon: Layers, label: 'Timetable', href: '/timetable' },
  { icon: Bus, label: 'Transport', href: '/transport' },
  { icon: Building, label: 'Rooms', href: '/rooms' },
  { icon: Library, label: 'Library', href: '/library' },
  { icon: HostelIcon, label: 'Hostel', href: '/hostel' },
  { icon: UtensilsCrossed, label: 'Mess', href: '/mess' },
  { icon: ShoppingBag, label: 'Canteen', href: '/canteen' },
  { icon: FlaskConical, label: 'Lab', href: '/lab' },
  { icon: Package, label: 'Inventory', href: '/inventory' },
  { icon: Building, label: 'Branches', href: '/branches' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-secondary-900 text-white transition-all duration-300 overflow-y-auto',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-secondary-800 px-4 sticky top-0 bg-secondary-900">
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
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
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
      <div className="border-t border-secondary-800 p-4 sticky bottom-0 bg-secondary-900">
        {user && !isCollapsed && (
          <div className="mb-3 text-sm">
            <div className="font-medium text-white">{user.fullName || user.username}</div>
            <div className="text-secondary-400 text-xs capitalize">{user.role}</div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-secondary-300 hover:bg-secondary-800 hover:text-white w-full transition-colors',
            isCollapsed && 'justify-center'
          )}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
