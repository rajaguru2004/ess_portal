'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import apiClient from '@/lib/api-client';
import { CreateRoleRequest } from '@/types';

interface CreateRoleDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateRoleDialog({ open, onClose, onSuccess }: CreateRoleDialogProps) {
    const [formData, setFormData] = useState<CreateRoleRequest>({
        name: '',
        code: '',
        description: '',
        isSystemRole: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await apiClient.createRole(formData);
            if (response.success) {
                // Reset form
                setFormData({ name: '', code: '', description: '', isSystemRole: false });
                onSuccess();
            } else {
                setError(response.message || 'Failed to create role');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create role');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ name: '', code: '', description: '', isSystemRole: false });
        setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>Create New Role</DialogTitle>
                    <DialogDescription>
                        Add a new role to the system
                    </DialogDescription>
                </DialogHeader>

                <DialogContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Role Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Manager"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="code">Role Code *</Label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            placeholder="e.g., MANAGER"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="e.g., Department Manager"
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isSystemRole"
                            checked={formData.isSystemRole}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setFormData({ ...formData, isSystemRole: e.target.checked })
                            }
                        />
                        <Label htmlFor="isSystemRole" className="cursor-pointer">
                            System Role
                        </Label>
                    </div>

                    {error && (
                        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm">
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
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                        {loading ? 'Creating...' : 'Create Role'}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}
