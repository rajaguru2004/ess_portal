'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import apiClient from '@/lib/api-client';
import { CreateRoleLeavePolicyRequest, Role, LeaveType } from '@/types';

interface CreateRoleLeavePolicyDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    roles: Role[];
    leaveTypes: LeaveType[];
}

export default function CreateRoleLeavePolicyDialog({ open, onClose, onSuccess, roles, leaveTypes }: CreateRoleLeavePolicyDialogProps) {
    const [formData, setFormData] = useState<CreateRoleLeavePolicyRequest>({
        roleId: '',
        leaveTypeId: '',
        annualQuota: 0,
        accrualType: 'ANNUAL', // Default
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await apiClient.createRoleLeavePolicy(formData);
            if (response.success) {
                setFormData({
                    roleId: '',
                    leaveTypeId: '',
                    annualQuota: 0,
                    accrualType: 'ANNUAL',
                });
                onSuccess();
            } else {
                setError(response.message || 'Failed to create policy');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create policy');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>Configure Leave Policy</DialogTitle>
                    <DialogDescription>Assign leave quotas to a specific role</DialogDescription>
                </DialogHeader>

                <DialogContent className="space-y-4">
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

                    <div className="space-y-2">
                        <Label htmlFor="leaveTypeId">Leave Type *</Label>
                        <select
                            id="leaveTypeId"
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.leaveTypeId}
                            onChange={(e) => setFormData({ ...formData, leaveTypeId: e.target.value })}
                            required
                        >
                            <option value="" className="bg-background text-foreground">Select Leave Type</option>
                            {leaveTypes.map((lt) => (
                                <option key={lt.id} value={lt.id} className="bg-background text-foreground">
                                    {lt.name} (Default: {lt.defaultDays})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="annualQuota">Annual Quota (Days) *</Label>
                            <Input
                                id="annualQuota"
                                type="number"
                                min="0"
                                value={formData.annualQuota}
                                onChange={(e) => setFormData({ ...formData, annualQuota: parseInt(e.target.value) || 0 })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="accrualType">Accrual Type *</Label>
                            <select
                                id="accrualType"
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.accrualType}
                                onChange={(e) => setFormData({ ...formData, accrualType: e.target.value })}
                                required
                            >
                                <option value="ANNUAL" className="bg-background text-foreground">Annual (Flat)</option>
                                <option value="MONTHLY" className="bg-background text-foreground">Monthly (Pro-rated)</option>
                                <option value="QUARTERLY" className="bg-background text-foreground">Quarterly</option>
                            </select>
                        </div>
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
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                        {loading ? 'Creating...' : 'Create Policy'}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}
