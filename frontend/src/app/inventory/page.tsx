'use client';

import React from 'react';
import { Package, Plus, AlertTriangle, ShoppingBag, FileText } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Inventory Management</h1>
          <p className="text-secondary-500 mt-1">Furniture, stationery, sports, electronics - branch-wise</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>Add Item</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Total Items</div>
              <div className="text-xl font-bold text-secondary-900">520</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Low Stock</div>
              <div className="text-xl font-bold text-secondary-900">8</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Issued</div>
              <div className="text-xl font-bold text-secondary-900">120</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Categories</div>
              <div className="text-xl font-bold text-secondary-900">12</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-secondary-200">
          <h2 className="font-semibold text-secondary-900">Inventory Items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Item</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Quantity</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Location</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              <tr className="hover:bg-secondary-50">
                <td className="px-4 py-3 font-medium text-secondary-900">Whiteboard Marker</td>
                <td className="px-4 py-3 text-secondary-600">Stationery</td>
                <td className="px-4 py-3 text-secondary-600">150</td>
                <td className="px-4 py-3 text-secondary-600">Store Room A</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">In Stock</span>
                </td>
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
