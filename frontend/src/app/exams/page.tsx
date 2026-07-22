'use client';

import React from 'react';
import { FileText, Plus, Calendar, Clock, Users, Download } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function ExamsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Examination</h1>
          <p className="text-secondary-500 mt-1">Manage exams, schedules, and results</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>Create Exam</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Total Exams</div>
              <div className="text-xl font-bold text-secondary-900">12</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Upcoming</div>
              <div className="text-xl font-bold text-secondary-900">3</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Completed</div>
              <div className="text-xl font-bold text-secondary-900">8</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Results Pending</div>
              <div className="text-xl font-bold text-secondary-900">1</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-secondary-200 flex items-center justify-between">
          <h2 className="font-semibold text-secondary-900">Upcoming Exams</h2>
          <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>Export Schedule</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Exam Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Subject</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Class</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Time</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              <tr className="hover:bg-secondary-50">
                <td className="px-4 py-3 font-medium text-secondary-900">Mid Term Exam</td>
                <td className="px-4 py-3 text-secondary-600">Mathematics</td>
                <td className="px-4 py-3 text-secondary-600">Class 10-A</td>
                <td className="px-4 py-3 text-secondary-600">25 Jul 2024</td>
                <td className="px-4 py-3 text-secondary-600">09:00 AM - 12:00 PM</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">Scheduled</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
