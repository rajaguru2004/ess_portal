'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import apiClient from '@/lib/api-client';
import { CreateUserRequest, Role, Department } from '@/types';
import { getUser } from '@/lib/auth';

interface CreateUserDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    roles: Role[];
    departments: Department[];
}

export default function CreateUserDialog({ open, onClose, onSuccess, roles, departments }: CreateUserDialogProps) {
    const currentUser = getUser();
    const [formData, setFormData] = useState<CreateUserRequest>({
        tenantId: currentUser?.tenantId || '',
        employeeCode: '',
        username: '',
        password: '',
        fullName: '',
        email: '',
        mobile: '',
        branchId: '',
        departmentId: '',
        roleId: '',
        managerId: null,
        isActive: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { isActive, ...payload } = formData;
            const response = await apiClient.createUser(payload);
            if (response.success) {
                setFormData({
                    tenantId: currentUser?.tenantId || '',
                    employeeCode: '',
                    username: '',
                    password: '',
                    fullName: '',
                    email: '',
                    mobile: '',
                    branchId: '',
                    departmentId: '',
                    roleId: '',
                    managerId: null,
                    isActive: true,
                });
                onSuccess();
            } else {
                setError(response.message || 'Failed to create user');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>Add a new user to the system</DialogDescription>
                </DialogHeader>

                <DialogContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="employeeCode">Employee Code *</Label>
                            <Input
                                id="employeeCode"
                                value={formData.employeeCode}
                                onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                                placeholder="e.g., EMP101"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username">Username *</Label>
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mobile">Mobile *</Label>
                            <Input
                                id="mobile"
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                placeholder="e.g., 9876543210"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="branchId">Branch ID *</Label>
                            <Input
                                id="branchId"
                                value={formData.branchId || ''}
                                onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                                placeholder="e.g., branch1"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="roleId">Role *</Label>
                            <select
                                id="roleId"
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.roleId}
                                onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                                required
                            >
                                <option value="" className="bg-background text-foreground">Select Role</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id} className="bg-background text-foreground">
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="departmentId">Department (Optional)</Label>
                        <select
                            id="departmentId"
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.departmentId || ''}
                            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value || undefined })}
                        >
                            <option value="" className="bg-background text-foreground">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id} className="bg-background text-foreground">
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>



                    {error && (
                        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm">
                            {error}
                        </div>
                    )}
                </DialogContent>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                        {loading ? 'Creating...' : 'Create User'}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}
