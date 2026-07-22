'use client';

import React, { useState } from 'react';
import { Calendar, Check, X, Clock, Download } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Attendance</h1>
          <p className="text-secondary-500 mt-1">Track student and staff attendance with RFID support</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button variant="outline" icon={<Download className="h-4 w-4" />}>Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Total Students</div>
              <div className="text-xl font-bold text-secondary-900">450</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Present Today</div>
              <div className="text-xl font-bold text-secondary-900">423</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <X className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Absent Today</div>
              <div className="text-xl font-bold text-secondary-900">27</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Late Today</div>
              <div className="text-xl font-bold text-secondary-900">12</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-secondary-200">
          <h2 className="font-semibold text-secondary-900">Attendance by Class</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Class</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Total</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Present</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Absent</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Percentage</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'].map((cls, i) => (
                <tr key={i} className="hover:bg-secondary-50">
                  <td className="px-4 py-3 font-medium text-secondary-900">{cls}</td>
                  <td className="px-4 py-3 text-secondary-600">60</td>
                  <td className="px-4 py-3 text-green-600">58</td>
                  <td className="px-4 py-3 text-red-600">2</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-secondary-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                      <span className="text-sm text-secondary-600">96%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm">View Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
