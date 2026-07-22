'use client';

import React from 'react';
import { DollarSign, TrendingUp, Users, FileText, Calculator } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function PayrollPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Payroll & Salary</h1>
          <p className="text-secondary-500 mt-1">Appraisal ratings, salary structure, increments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Calculator className="h-4 w-4" />}>Calculate Salary</Button>
          <Button leftIcon={<FileText className="h-4 w-4" />}>Run Payroll</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Total Staff</div>
              <div className="text-xl font-bold text-secondary-900">45</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Monthly Payroll</div>
              <div className="text-xl font-bold text-secondary-900">₹18.5L</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Avg. Rating</div>
              <div className="text-xl font-bold text-secondary-900">4.2/5</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-secondary-500">Pending Increments</div>
          <div className="text-xl font-bold text-secondary-900">12</div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-secondary-200">
          <h2 className="font-semibold text-secondary-900">Appraisal Ratings (Director enters increment %)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Staff</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Student Rating</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Parent Rating</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Principal</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Attendance</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Avg</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Increment %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              <tr className="hover:bg-secondary-50">
                <td className="px-4 py-3 font-medium text-secondary-900">Rajesh Kumar</td>
                <td className="px-4 py-3 text-secondary-600">4.5</td>
                <td className="px-4 py-3 text-secondary-600">4.2</td>
                <td className="px-4 py-3 text-secondary-600">4.0</td>
                <td className="px-4 py-3 text-secondary-600">95%</td>
                <td className="px-4 py-3 font-medium text-green-600">4.2</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    placeholder="%"
                    className="w-16 px-2 py-1 border border-secondary-200 rounded"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
