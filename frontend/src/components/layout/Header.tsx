'use client';

import React from 'react';
import { Search, Bell, Menu, Building2 } from 'lucide-react';
import { useAuthStore, useBranchStore } from '@/store/authStore';
import { Button } from '../ui';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuthStore();
  const { currentBranch, branchInfo } = useBranchStore();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-secondary-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden rounded-lg p-2 hover:bg-secondary-100"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Branch selector */}
          {user?.branchAccess && user.branchAccess.length > 1 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary-50">
              <Building2 className="h-4 w-4 text-secondary-500" />
              <select
                value={currentBranch || ''}
                onChange={(e) => useBranchStore.getState().setCurrentBranch(e.target.value)}
                className="bg-transparent text-sm font-medium text-secondary-700 focus:outline-none"
              >
                {user.branchAccess.map((branch: any) => (
                  <option key={branch.branch_id} value={branch.branch_id}>
                    {branch.branch_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-secondary-50 rounded-lg w-64">
            <Search className="h-4 w-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm flex-1 focus:outline-none"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative rounded-lg p-2 hover:bg-secondary-100">
            <Bell className="h-5 w-5 text-secondary-600" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User avatar */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700">
                {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-secondary-900">{user?.fullName || user?.username}</p>
              <p className="text-xs text-secondary-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
