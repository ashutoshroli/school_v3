'use client';

import React from 'react';
import { Users, Plus, Search, Download, Filter } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Staff Management</h1>
          <p className="text-secondary-500 mt-1">Manage teachers and staff members</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>Add Staff</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-secondary-500">Total Staff</div>
          <div className="text-2xl font-bold text-secondary-900">45</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-secondary-500">Teachers</div>
          <div className="text-2xl font-bold text-secondary-900">32</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-secondary-500">Non-Teaching</div>
          <div className="text-2xl font-bold text-secondary-900">13</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-secondary-500">On Leave</div>
          <div className="text-2xl font-bold text-secondary-900">3</div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-secondary-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search staff..."
                className="pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <Button variant="outline" size="sm" leftIcon={<Filter className="h-4 w-4" />}>Filter</Button>
          </div>
          <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>Export</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Employee ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Department</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Designation</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              <tr className="hover:bg-secondary-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="font-medium text-secondary-900">Rajesh Kumar</div>
                      <div className="text-sm text-secondary-500">rajesh@school.com</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-secondary-600">EMP001</td>
                <td className="px-4 py-3 text-secondary-600">Science</td>
                <td className="px-4 py-3 text-secondary-600">Senior Teacher</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Active</span>
                </td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm">View</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
