'use client';

import React from 'react';
import { Bus, Plus, MapPin, Users, Route, Fuel } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function TransportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Transport Management</h1>
          <p className="text-secondary-500 mt-1">Manage buses, routes, drivers, GPS tracking & diesel</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />}>Add Vehicle</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bus className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Total Vehicles</div>
              <div className="text-xl font-bold text-secondary-900">15</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Route className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Active Routes</div>
              <div className="text-xl font-bold text-secondary-900">12</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Students Using</div>
              <div className="text-xl font-bold text-secondary-900">320</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <MapPin className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Total Stops</div>
              <div className="text-xl font-bold text-secondary-900">48</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Fuel className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Diesel Requests</div>
              <div className="text-xl font-bold text-secondary-900">3</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-secondary-200">
          <h2 className="font-semibold text-secondary-900">Vehicles</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Vehicle No</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Route</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Driver</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">GPS Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              <tr className="hover:bg-secondary-50">
                <td className="px-4 py-3 font-medium text-secondary-900">UP32 AB 1234</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">Own</span>
                </td>
                <td className="px-4 py-3 text-secondary-600">Route 1 - City Center</td>
                <td className="px-4 py-3 text-secondary-600">Ramesh Yadav</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Online</span>
                </td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm">Track</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
