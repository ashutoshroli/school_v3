'use client';

import React from 'react';
import { Calendar, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function LeavePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Leave Management</h1>
          <p className="text-secondary-500 mt-1">Manage leave requests and approvals (2-level: Staff → VP → Principal)</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />}>Apply Leave</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Approved</div>
              <div className="text-xl font-bold text-secondary-900">45</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Rejected</div>
              <div className="text-xl font-bold text-secondary-900">5</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">On Leave Today</div>
              <div className="text-xl font-bold text-secondary-900">3</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-secondary-200">
          <h2 className="font-semibold text-secondary-900">Pending Leave Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Applicant</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">From</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">To</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Days</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Reason</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              <tr className="hover:bg-secondary-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-secondary-900">Priya Singh</div>
                  <div className="text-sm text-secondary-500">Teacher - Science</div>
                </td>
                <td className="px-4 py-3 text-secondary-600">Sick Leave</td>
                <td className="px-4 py-3 text-secondary-600">25 Jul 2024</td>
                <td className="px-4 py-3 text-secondary-600">26 Jul 2024</td>
                <td className="px-4 py-3 text-secondary-600">2</td>
                <td className="px-4 py-3 text-secondary-600">Medical emergency</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-green-600">Approve</Button>
                    <Button variant="outline" size="sm" className="text-red-600">Reject</Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
