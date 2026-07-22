'use client';

import React from 'react';
import { ShoppingBag, Plus, CreditCard, Package, AlertTriangle } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function CanteenPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Canteen Management</h1>
          <p className="text-secondary-500 mt-1">Inventory, prepaid wallet (RFID), counter billing</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>Add Item</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Items</div>
              <div className="text-xl font-bold text-secondary-900">45</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Wallet Balance</div>
              <div className="text-xl font-bold text-secondary-900">₹12K</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Today Sales</div>
              <div className="text-xl font-bold text-secondary-900">₹3,500</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-secondary-500">Counters</div>
          <div className="text-xl font-bold text-secondary-900">3</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Low Stock</div>
              <div className="text-xl font-bold text-secondary-900">5</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-secondary-200">
          <h2 className="font-semibold text-secondary-900">Inventory (Stock in/out, rack placement, appliances)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Item</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Counter</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              <tr className="hover:bg-secondary-50">
                <td className="px-4 py-3 font-medium text-secondary-900">Samosa</td>
                <td className="px-4 py-3 text-secondary-600">Snacks</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">50</span>
                </td>
                <td className="px-4 py-3 text-secondary-600">₹15</td>
                <td className="px-4 py-3 text-secondary-600">Counter 1</td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
