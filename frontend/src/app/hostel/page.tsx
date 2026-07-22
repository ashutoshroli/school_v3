'use client';

import React from 'react';
import { Home, Plus, Users, BedDouble, DoorOpen } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function HostelPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Hostel Management</h1>
          <p className="text-secondary-500 mt-1">Room types: Single, Double, Triple, Custom | RFID attendance</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>Add Room</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Home className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Total Rooms</div>
              <div className="text-xl font-bold text-secondary-900">50</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <BedDouble className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Total Beds</div>
              <div className="text-xl font-bold text-secondary-900">150</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Occupied</div>
              <div className="text-xl font-bold text-secondary-900">128</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DoorOpen className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Vacant</div>
              <div className="text-xl font-bold text-secondary-900">22</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-secondary-200">
          <h2 className="font-semibold text-secondary-900">Room Allotment Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Student</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Room Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Requested</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              <tr className="hover:bg-secondary-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-secondary-900">Rahul Kumar</div>
                  <div className="text-sm text-secondary-500">Class 10-A</div>
                </td>
                <td className="px-4 py-3 text-secondary-600">Double</td>
                <td className="px-4 py-3 text-secondary-600">22 Jul 2024</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">Pending Roommate Approval</span>
                </td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm">View</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
