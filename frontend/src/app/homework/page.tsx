'use client';

import React from 'react';
import { BookOpen, Plus, Upload, CheckCircle, Clock } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function HomeworkPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Homework Management</h1>
          <p className="text-secondary-500 mt-1">Assignments with submission tracking & grading</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />}>Assign Homework</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Total Assigned</div>
              <div className="text-xl font-bold text-secondary-900">24</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Pending</div>
              <div className="text-xl font-bold text-secondary-900">8</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Upload className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Late Submissions</div>
              <div className="text-xl font-bold text-secondary-900">3</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Graded</div>
              <div className="text-xl font-bold text-secondary-900">13</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-secondary-200">
          <h2 className="font-semibold text-secondary-900">Recent Homework</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Subject</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Class</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Due Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Submissions</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              <tr className="hover:bg-secondary-50">
                <td className="px-4 py-3 font-medium text-secondary-900">Mathematics</td>
                <td className="px-4 py-3 text-secondary-600">Chapter 5 Exercises</td>
                <td className="px-4 py-3 text-secondary-600">Class 10-A</td>
                <td className="px-4 py-3 text-secondary-600">25 Jul 2024</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">35/40</span>
                </td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm">Review</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
