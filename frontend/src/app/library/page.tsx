'use client';

import React from 'react';
import { Book, Plus, Users, AlertTriangle, Search } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Library Management</h1>
          <p className="text-secondary-500 mt-1">Manage books, issues, and fines</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />}>Add Book</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Book className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Total Books</div>
              <div className="text-xl font-bold text-secondary-900">5,240</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Issued Today</div>
              <div className="text-xl font-bold text-secondary-900">45</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Overdue</div>
              <div className="text-xl font-bold text-secondary-900">12</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-secondary-500">Fine Pending</div>
          <div className="text-xl font-bold text-secondary-900">₹2,450</div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-secondary-200 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search books by title, author, ISBN..."
              className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Book</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">ISBN</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Available</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Location</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              <tr className="hover:bg-secondary-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-secondary-900">Mathematics for Class 10</div>
                  <div className="text-sm text-secondary-500">by R.D. Sharma</div>
                </td>
                <td className="px-4 py-3 text-secondary-600">978-81-1234-567-8</td>
                <td className="px-4 py-3 text-secondary-600">Textbook</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">15/20</span>
                </td>
                <td className="px-4 py-3 text-secondary-600">Rack A-12</td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm">Issue</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
