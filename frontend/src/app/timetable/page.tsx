'use client';

import React from 'react';
import { Calendar, Plus, Clock, AlertCircle } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function TimetablePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Timetable Management</h1>
          <p className="text-secondary-500 mt-1">Class timetable with clash detection</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>Create Timetable</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Classes</div>
              <div className="text-xl font-bold text-secondary-900">25</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Periods/Day</div>
              <div className="text-xl font-bold text-secondary-900">8</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Clash Warnings</div>
              <div className="text-xl font-bold text-secondary-900">2</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-secondary-500">Mode</div>
          <div className="text-xl font-bold text-secondary-900">Warning</div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-secondary-200">
          <h2 className="font-semibold text-secondary-900">Class 10-A Timetable</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Period</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Mon</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Tue</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Wed</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Thu</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Fri</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Sat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              <tr className="hover:bg-secondary-50">
                <td className="px-4 py-3 font-medium text-secondary-900">1 (9:00-9:45)</td>
                <td className="px-4 py-3 text-secondary-600">Maths</td>
                <td className="px-4 py-3 text-secondary-600">English</td>
                <td className="px-4 py-3 text-secondary-600">Science</td>
                <td className="px-4 py-3 text-secondary-600">Hindi</td>
                <td className="px-4 py-3 text-secondary-600">Maths</td>
                <td className="px-4 py-3 text-secondary-600">Games</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
