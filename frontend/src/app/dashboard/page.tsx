'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, GraduationCap, DollarSign, Calendar, LogOut } from 'lucide-react';

interface Stats {
  students: number;
  staff: number;
  classes: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchStats(token);
  }, [router]);

  const fetchStats = async (token: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/branches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        const branchId = data.data[0].id;
        const statsResponse = await fetch(`${apiUrl}/branches/${branchId}/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statsData = await statsResponse.json();
        setStats(statsData.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white border-b border-secondary-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-secondary-900">School ERP</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary-600">
              {user.fullName || user.username} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-secondary-600 hover:text-secondary-900"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-secondary-900 mb-6">Dashboard</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500">Total Students</p>
              <p className="text-2xl font-bold text-secondary-900">{stats?.students || 0}</p>
            </div>
          </div>

          <div className="card flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500">Total Staff</p>
              <p className="text-2xl font-bold text-secondary-900">{stats?.staff || 0}</p>
            </div>
          </div>

          <div className="card flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500">Total Classes</p>
              <p className="text-2xl font-bold text-secondary-900">{stats?.classes || 0}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/students')}
              className="p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors text-center"
            >
              <Users className="h-6 w-6 mx-auto mb-2 text-secondary-600" />
              <span className="text-sm font-medium">Students</span>
            </button>
            <button
              onClick={() => router.push('/staff')}
              className="p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors text-center"
            >
              <GraduationCap className="h-6 w-6 mx-auto mb-2 text-secondary-600" />
              <span className="text-sm font-medium">Staff</span>
            </button>
            <button
              onClick={() => router.push('/fees')}
              className="p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors text-center"
            >
              <DollarSign className="h-6 w-6 mx-auto mb-2 text-secondary-600" />
              <span className="text-sm font-medium">Fees</span>
            </button>
            <button
              onClick={() => router.push('/attendance')}
              className="p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors text-center"
            >
              <Calendar className="h-6 w-6 mx-auto mb-2 text-secondary-600" />
              <span className="text-sm font-medium">Attendance</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
