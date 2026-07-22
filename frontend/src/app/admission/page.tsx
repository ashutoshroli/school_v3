'use client';

import React from 'react';
import { UserPlus, Plus, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function AdmissionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Admission Management</h1>
          <p className="text-secondary-500 mt-1">Enquiry → Application → Entrance Test → Approval → Payment</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>New Admission</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserPlus className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Enquiries</div>
              <div className="text-xl font-bold text-secondary-900">45</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FileText className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Applications</div>
              <div className="text-xl font-bold text-secondary-900">28</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Test Pending</div>
              <div className="text-xl font-bold text-secondary-900">15</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Confirmed</div>
              <div className="text-xl font-bold text-secondary-900">8</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Rejected</div>
              <div className="text-xl font-bold text-secondary-900">2</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-secondary-200">
          <h2 className="font-semibold text-secondary-900">Recent Applications (Front Office - Final Approval)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Applicant</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Class</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Test Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Seat Check</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Fee Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              <tr className="hover:bg-secondary-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-secondary-900">Rahul Sharma</div>
                  <div className="text-sm text-secondary-500">Father: Ramesh Sharma</div>
                </td>
                <td className="px-4 py-3 text-secondary-600">Class 6</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Passed</span>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">Available</span>
                </td>
                <td className="px-4 py-3 text-secondary-600">Pending</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">Under Review</span>
                </td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm">Approve</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
