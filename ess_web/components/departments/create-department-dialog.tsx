'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import apiClient from '@/lib/api-client';
import { CreateDepartmentRequest } from '@/types';
import { getUser } from '@/lib/auth';

interface CreateDepartmentDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateDepartmentDialog({ open, onClose, onSuccess }: CreateDepartmentDialogProps) {
    const user = getUser();
    const [formData, setFormData] = useState<CreateDepartmentRequest>({
        tenantId: user?.tenantId || '',
        branchId: '',
        name: '',
        code: '',
        managerId: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await apiClient.createDepartment(formData);
            if (response.success) {
                setFormData({ tenantId: user?.tenantId || '', branchId: '', name: '', code: '', managerId: null });
                onSuccess();
            } else {
                setError(response.message || 'Failed to create department');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create department');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ tenantId: user?.tenantId || '', branchId: '', name: '', code: '', managerId: null });
        setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>Create New Department</DialogTitle>
                    <DialogDescription>Add a new department to the organization</DialogDescription>
                </DialogHeader>

                <DialogContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Department Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Human Resources"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="code">Department Code *</Label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            placeholder="e.g., HR_001"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="branchId">Branch ID *</Label>
                        <Input
                            id="branchId"
                            value={formData.branchId}
                            onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                            placeholder="e.g., BRANCH_001"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm">
                            {error}
                        </div>
                    )}
                </DialogContent>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                        {loading ? 'Creating...' : 'Create Department'}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}
