'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Plus, Edit, Trash2, MapPin, Phone, Mail, Users, Settings, Eye } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { authAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Branch {
  id: string;
  branch_code: string;
  branch_name: string;
  city: string;
  state: string;
  status: string;
  max_students: number;
  max_staff: number;
  created_at: string;
}

export default function BranchesPage() {
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState({
    branch_name: '',
    branch_code: '',
    city: '',
    state: '',
    address: '',
    phone: '',
    email: '',
    max_students: 15000,
    max_staff: 500,
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/branches`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setBranches(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/branches`;
      const method = editingBranch ? 'PUT' : 'POST';
      const body = editingBranch ? { ...formData, id: editingBranch.id } : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.success) {
        setShowModal(false);
        setEditingBranch(null);
        setFormData({
          branch_name: '',
          branch_code: '',
          city: '',
          state: '',
          address: '',
          phone: '',
          email: '',
          max_students: 15000,
          max_staff: 500,
        });
        fetchBranches();
      }
    } catch (error) {
      console.error('Error saving branch:', error);
    }
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      branch_name: branch.branch_name,
      branch_code: branch.branch_code,
      city: branch.city || '',
      state: branch.state || '',
      address: '',
      phone: '',
      email: '',
      max_students: branch.max_students,
      max_staff: branch.max_staff,
    });
    setShowModal(true);
  };

  const handleDelete = async (branchId: string) => {
    if (!confirm('Are you sure you want to delete this branch?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/branches/${branchId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchBranches();
    } catch (error) {
      console.error('Error deleting branch:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Branch Management</h1>
          <p className="text-secondary-500 mt-1">Create and manage school branches</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowModal(true)}>
          Add Branch
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-secondary-500">Total Branches</div>
              <div className="text-xl font-bold text-secondary-900">{branches.length}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-secondary-500">Active</div>
          <div className="text-xl font-bold text-green-600">
            {branches.filter(b => b.status === 'active').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-secondary-500">Max Students</div>
          <div className="text-xl font-bold text-secondary-900">
            {branches.reduce((sum, b) => sum + (b.max_students || 0), 0).toLocaleString()}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-secondary-500">Max Staff</div>
          <div className="text-xl font-bold text-secondary-900">
            {branches.reduce((sum, b) => sum + (b.max_staff || 0), 0).toLocaleString()}
          </div>
        </Card>
      </div>

      {/* Branch List */}
      <Card>
        <div className="p-4 border-b border-secondary-200">
          <h2 className="font-semibold text-secondary-900">All Branches</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Branch</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Code</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Location</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Capacity</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {branches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-secondary-500">
                    No branches found. Click "Add Branch" to create one.
                  </td>
                </tr>
              ) : (
                branches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-secondary-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-secondary-900">{branch.branch_name}</div>
                    </td>
                    <td className="px-4 py-3 text-secondary-600">{branch.branch_code}</td>
                    <td className="px-4 py-3 text-secondary-600">
                      {branch.city}, {branch.state}
                    </td>
                    <td className="px-4 py-3 text-secondary-600">
                      <div className="text-sm">
                        <div>Students: {branch.max_students?.toLocaleString()}</div>
                        <div>Staff: {branch.max_staff}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        branch.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {branch.status || 'active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(branch)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(branch.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingBranch ? 'Edit Branch' : 'Add New Branch'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Branch Name
                </label>
                <input
                  type="text"
                  value={formData.branch_name}
                  onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Branch Code
                </label>
                <input
                  type="text"
                  value={formData.branch_code}
                  onChange={(e) => setFormData({ ...formData, branch_code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                  maxLength={10}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Max Students</label>
                  <input
                    type="number"
                    value={formData.max_students}
                    onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Max Staff</label>
                  <input
                    type="number"
                    value={formData.max_staff}
                    onChange={(e) => setFormData({ ...formData, max_staff: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:-outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => {
                  setShowModal(false);
                  setEditingBranch(null);
                }}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingBranch ? 'Update' : 'Create'} Branch
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
