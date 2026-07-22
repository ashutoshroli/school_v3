'use client';

import React from 'react';
import { Building, Plus, Users, Layers } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function RoomsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Room Management</h1>
          <p className="text-secondary-500 mt-1">Branch → Building → Floor → Room → Cabin</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />}>Add Room</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Buildings</div>
              <div className="text-xl font-bold text-secondary-900">3</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Layers className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Total Rooms</div>
              <div className="text-xl font-bold text-secondary-900">45</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-secondary-500">Classrooms</div>
          <div className="text-xl font-bold text-secondary-900">25</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-secondary-500">Labs</div>
          <div className="text-xl font-bold text-secondary-900">8</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: 'Room 101', type: 'Classroom', building: 'Block A', floor: 1, capacity: 40 },
          { name: 'Room 102', type: 'Classroom', building: 'Block A', floor: 1, capacity: 40 },
          { name: 'Physics Lab', type: 'Lab', building: 'Block B', floor: 2, capacity: 30 },
          { name: 'Chemistry Lab', type: 'Lab', building: 'Block B', floor: 2, capacity: 30 },
          { name: 'Computer Lab', type: 'Lab', building: 'Block C', floor: 1, capacity: 50 },
          { name: 'Conference Room', type: 'Shared', building: 'Block A', floor: 3, capacity: 20 },
        ].map((room, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-secondary-900">{room.name}</h3>
                <p className="text-sm text-secondary-500">{room.type}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${i % 2 === 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {i % 2 === 0 ? 'Available' : 'Occupied'}
              </span>
            </div>
            <div className="text-sm text-secondary-600 space-y-1">
              <div>{room.building} • Floor {room.floor}</div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Capacity: {room.capacity}</span>
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
