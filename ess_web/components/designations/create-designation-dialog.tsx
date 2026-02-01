'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import apiClient from '@/lib/api-client';
import { CreateDesignationRequest } from '@/types';
import { getUser } from '@/lib/auth';

interface CreateDesignationDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateDesignationDialog({ open, onClose, onSuccess }: CreateDesignationDialogProps) {
    const user = getUser();
    const [formData, setFormData] = useState<CreateDesignationRequest>({
        tenantId: user?.tenantId || '',
        name: '',
        code: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await apiClient.createDesignation(formData);
            if (response.success) {
                setFormData({
                    tenantId: user?.tenantId || '',
                    name: '',
                    code: '',
                });
                onSuccess();
            } else {
                setError(response.message || 'Failed to create designation');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create designation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>Create New Designation</DialogTitle>
                    <DialogDescription>Add a new job title or position</DialogDescription>
                </DialogHeader>

                <DialogContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Designation Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Software Engineer"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="code">Designation Code *</Label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            placeholder="e.g., SE_001"
                            required
                        />
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
                        {loading ? 'Creating...' : 'Create Designation'}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}
