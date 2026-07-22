'use client';

import React from 'react';
import { Building, Plus, Users, Calendar, Clock } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function RoomsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Room Management</h1>
          <p className="text-secondary-500 mt-1">Manage classrooms, labs, and facilities</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />}>Add Room</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Total Rooms</div>
              <div className="text-xl font-bold text-secondary-900">25</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-secondary-500">Classrooms</div>
          <div className="text-xl font-bold text-secondary-900">18</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-secondary-500">Labs</div>
          <div className="text-xl font-bold text-secondary-900">4</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-secondary-500">Other</div>
          <div className="text-xl font-bold text-secondary-900">3</div>
        </Card>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {['Room 101', 'Room 102', 'Room 103', 'Room 201', 'Room 202', 'Lab 1'].map((room, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-secondary-900">{room}</h3>
                <p className="text-sm text-secondary-500">{i < 3 ? 'Classroom' : i < 5 ? 'Science Lab' : 'Computer Lab'}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${i % 2 === 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {i % 2 === 0 ? 'Available' : 'Occupied'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-secondary-600">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Capacity: 40</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-secondary-100">
              <Button variant="outline" size="sm" className="w-full">View Schedule</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
