'use client';

import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Download, Plus, CreditCard } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function FeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Fee Management</h1>
          <p className="text-secondary-500 mt-1">Track fee collection and pending payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>Export Report</Button>
          <Button leftIcon={<Plus className="h-4 w-4" />}>Collect Fee</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Total Collection</div>
              <div className="text-xl font-bold text-secondary-900">₹12,45,000</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">This Month</div>
              <div className="text-xl font-bold text-secondary-900">₹1,85,000</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Pending</div>
              <div className="text-xl font-bold text-secondary-900">₹3,20,000</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Defaulters</div>
              <div className="text-xl font-bold text-secondary-900">45</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-secondary-200">
          <h2 className="font-semibold text-secondary-900">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Receipt No</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Student</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Class</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Fee Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              <tr className="hover:bg-secondary-50">
                <td className="px-4 py-3 font-medium text-secondary-900">RCP001234</td>
                <td className="px-4 py-3 text-secondary-600">Rahul Sharma</td>
                <td className="px-4 py-3 text-secondary-600">Class 10-A</td>
                <td className="px-4 py-3 text-secondary-600">Tuition Fee</td>
                <td className="px-4 py-3 font-medium text-green-600">₹5,000</td>
                <td className="px-4 py-3 text-secondary-600">22 Jul 2024</td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm">Print</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
