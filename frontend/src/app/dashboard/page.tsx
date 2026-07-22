'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  GraduationCap,
  DollarSign,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { StatsCard, Card } from '@/components/ui';
import { DashboardLayout } from '@/components/layout';
import { useAuthStore, useBranchStore } from '@/store/authStore';
import { dashboardAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface DashboardStats {
  students: {
    total: number;
    active: number;
    male: number;
    female: number;
  };
  staff: {
    total: number;
    active: number;
    teachers: number;
  };
  fees: {
    total: number;
    collected: number;
    pending: number;
    collectionPercentage: string;
  };
  todayAttendance: {
    present: number;
    absent: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuthStore();
  const { currentBranch } = useBranchStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentBranch) return;

      try {
        const response = await dashboardAPI.getBranch(currentBranch);
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [currentBranch]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-secondary-500 mt-1">
            Welcome back, {user?.fullName || user?.username}!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Students"
            value={stats?.students.total || 0}
            leftIcon={<Users className="h-6 w-6" />}
            iconBg="bg-blue-100"
          />
          <StatsCard
            title="Total Staff"
            value={stats?.staff.total || 0}
            leftIcon={<GraduationCap className="h-6 w-6" />}
            iconBg="bg-green-100"
          />
          <StatsCard
            title="Fee Collection"
            value={formatCurrency(stats?.fees.collected || 0)}
            leftIcon={<DollarSign className="h-6 w-6" />}
            iconBg="bg-yellow-100"
          />
          <StatsCard
            title="Today's Attendance"
            value={`${stats?.todayAttendance.present || 0} / ${(stats?.todayAttendance.present || 0) + (stats?.todayAttendance.absent || 0)}`}
            leftIcon={<Calendar className="h-6 w-6" />}
            iconBg="bg-purple-100"
          />
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fee Collection Chart */}
          <Card title="Fee Collection Overview">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-500">Total Fees</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {formatCurrency(stats?.fees.total || 0)}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-500">Collection Progress</span>
                  <span className="font-medium">{stats?.fees.collectionPercentage}%</span>
                </div>
                <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 rounded-full transition-all"
                    style={{ width: `${stats?.fees.collectionPercentage || 0}%` }}
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-secondary-600">
                    Collected: {formatCurrency(stats?.fees.collected || 0)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-secondary-600">
                    Pending: {formatCurrency(stats?.fees.pending || 0)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Today's Attendance */}
          <Card title="Today's Attendance">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600">Present</p>
                  <p className="text-2xl font-bold text-green-700">
                    {stats?.todayAttendance.present || 0}
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600">Absent</p>
                  <p className="text-2xl font-bold text-red-700">
                    {stats?.todayAttendance.absent || 0}
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-sm text-secondary-500 mb-2">Attendance Rate</p>
                <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${
                        ((stats?.todayAttendance.present || 0) /
                          ((stats?.todayAttendance.present || 0) +
                            (stats?.todayAttendance.absent || 1))) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/students')}
              className="p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors text-center"
            >
              <Users className="h-6 w-6 mx-auto mb-2 text-secondary-600" />
              <span className="text-sm font-medium text-secondary-900">Manage Students</span>
            </button>
            <button
              onClick={() => router.push('/staff')}
              className="p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors text-center"
            >
              <GraduationCap className="h-6 w-6 mx-auto mb-2 text-secondary-600" />
              <span className="text-sm font-medium text-secondary-900">Manage Staff</span>
            </button>
            <button
              onClick={() => router.push('/attendance')}
              className="p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors text-center"
            >
              <Calendar className="h-6 w-6 mx-auto mb-2 text-secondary-600" />
              <span className="text-sm font-medium text-secondary-900">Mark Attendance</span>
            </button>
            <button
              onClick={() => router.push('/fees')}
              className="p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors text-center"
            >
              <DollarSign className="h-6 w-6 mx-auto mb-2 text-secondary-600" />
              <span className="text-sm font-medium text-secondary-900">Fee Management</span>
            </button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
