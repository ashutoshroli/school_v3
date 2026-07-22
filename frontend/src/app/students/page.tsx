'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, Download, Upload } from 'lucide-react';
import { Button, Input, Table, Card, Badge, StatusBadge, Pagination } from '@/components/ui';
import { DashboardLayout } from '@/components/layout';
import { useAuthStore, useBranchStore } from '@/store/authStore';
import { studentAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface Student {
  id: string;
  admission_number: string;
  full_name: string;
  email?: string;
  phone?: string;
  class_name?: string;
  section_name?: string;
  roll_number?: string;
  status: string;
  admission_date: string;
}

export default function StudentsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { currentBranch } = useBranchStore();
  
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!currentBranch) return;

      setIsLoading(true);
      try {
        const response = await studentAPI.list(currentBranch, {
          page,
          limit: 20,
          search,
        });
        setStudents(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [currentBranch, page, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const columns = [
    {
      key: 'admission_number',
      header: 'Admission No.',
      render: (item: Student) => (
        <span className="font-mono text-sm">{item.admission_number}</span>
      ),
    },
    {
      key: 'full_name',
      header: 'Name',
      render: (item: Student) => (
        <div>
          <p className="font-medium">{item.full_name}</p>
          {item.roll_number && (
            <p className="text-xs text-secondary-500">Roll: {item.roll_number}</p>
          )}
        </div>
      ),
    },
    {
      key: 'class',
      header: 'Class',
      render: (item: Student) => (
        <span>
          {item.class_name} {item.section_name && `- ${item.section_name}`}
        </span>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (item: Student) => (
        <div className="text-sm">
          {item.phone && <p>{item.phone}</p>}
          {item.email && <p className="text-secondary-500">{item.email}</p>}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Student) => <StatusBadge status={item.status} />,
    },
    {
      key: 'admission_date',
      header: 'Admission Date',
      render: (item: Student) => formatDate(item.admission_date),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Student) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/students/${item.id}`)}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/students/${item.id}/edit`)}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Students</h1>
            <p className="text-secondary-500 mt-1">
              Manage student records and information
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
              Export
            </Button>
            <Button variant="outline" leftIcon={<Upload className="h-4 w-4" />}>
              Import
            </Button>
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => router.push('/students/new')}>
              Add Student
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or admission number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <Button variant="outline" type="submit">
              Search
            </Button>
            <Button variant="ghost" leftIcon={<Filter className="h-4 w-4" />}>
              Filters
            </Button>
          </form>
        </Card>

        {/* Table */}
        <Card noPadding>
          <Table
            columns={columns}
            data={students}
            keyExtractor={(item) => item.id}
            isLoading={isLoading}
            emptyMessage="No students found"
            onRowClick={(item) => router.push(`/students/${item.id}`)}
          />
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={setPage}
            />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
