'use client';

import React from 'react';
import { FlaskConical, Plus, AlertTriangle, Users, Package } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function LabPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Lab Management</h1>
          <p className="text-secondary-500 mt-1">Equipment issue (group/individual), damage fines, expiry alerts</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>Add Equipment</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FlaskConical className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Total Equipment</div>
              <div className="text-xl font-bold text-secondary-900">120</div>
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
              <div className="text-xl font-bold text-secondary-900">15</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Expiring Soon</div>
              <div className="text-xl font-bold text-secondary-900">3</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Package className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Damaged</div>
              <div className="text-xl font-bold text-secondary-900">2</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-secondary-200">
          <h2 className="font-semibold text-secondary-900">Equipment Inventory (Physics, Chemistry, Biology, Computer Labs)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Equipment</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Lab</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Quantity</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Condition</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Expiry</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              <tr className="hover:bg-secondary-50">
                <td className="px-4 py-3 font-medium text-secondary-900">Microscope</td>
                <td className="px-4 py-3 text-secondary-600">Biology</td>
                <td className="px-4 py-3 text-secondary-600">20</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Good</span>
                </td>
                <td className="px-4 py-3 text-secondary-600">-</td>
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
