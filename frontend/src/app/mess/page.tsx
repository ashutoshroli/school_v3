'use client';

import React from 'react';
import { UtensilsCrossed, Plus, Users, Calendar, DollarSign } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function MessPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Mess Management</h1>
          <p className="text-secondary-500 mt-1">Meal plans: week-wise, veg/non-veg | Monthly fixed billing</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>Add Menu</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Subscribers</div>
              <div className="text-xl font-bold text-secondary-900">180</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UtensilsCrossed className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Meals/Day</div>
              <div className="text-xl font-bold text-secondary-900">3</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Monthly Bill</div>
              <div className="text-xl font-bold text-secondary-900">₹54,000</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Guest Meals</div>
              <div className="text-xl font-bold text-secondary-900">15</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-secondary-200">
          <h2 className="font-semibold text-secondary-900">This Week Menu (Approval: Mess Incharge → Warden → Principal → Director)</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <Card key={day} className="p-3">
                <div className="font-medium text-secondary-900 mb-2">{day}</div>
                <div className="text-sm text-secondary-600 space-y-1">
                  <div><span className="text-xs font-medium">B:</span> Paratha</div>
                  <div><span className="text-xs font-medium">L:</span> Dal-Rice</div>
                  <div><span className="text-xs font-medium">D:</span> Roti-Sabzi</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
