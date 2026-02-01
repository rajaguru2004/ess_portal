'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import apiClient from '@/lib/api-client';
import { CreateLeaveTypeRequest } from '@/types';
import { getUser } from '@/lib/auth';

interface CreateLeaveTypeDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateLeaveTypeDialog({ open, onClose, onSuccess }: CreateLeaveTypeDialogProps) {
    const user = getUser();
    const [formData, setFormData] = useState<CreateLeaveTypeRequest>({
        tenantId: user?.tenantId || '',
        name: '',
        code: '',
        defaultDays: 12,
        carryForwardAllowed: false,
        maxCarryForward: 0,
        encashmentAllowed: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await apiClient.createLeaveType(formData);
            if (response.success) {
                setFormData({
                    tenantId: user?.tenantId || '',
                    name: '',
                    code: '',
                    defaultDays: 12,
                    carryForwardAllowed: false,
                    maxCarryForward: 0,
                    encashmentAllowed: false,
                });
                onSuccess();
            } else {
                setError(response.message || 'Failed to create leave type');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create leave type');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>Create New Leave Type</DialogTitle>
                    <DialogDescription>Add a new leave category to the system</DialogDescription>
                </DialogHeader>

                <DialogContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Leave Type Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Casual Leave"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="code">Leave Code *</Label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            placeholder="e.g., CL"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="defaultDays">Default Days *</Label>
                        <Input
                            id="defaultDays"
                            type="number"
                            value={formData.defaultDays}
                            onChange={(e) => setFormData({ ...formData, defaultDays: parseInt(e.target.value) })}
                            min="1"
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="carryForwardAllowed"
                            checked={formData.carryForwardAllowed}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setFormData({ ...formData, carryForwardAllowed: e.target.checked })
                            }
                        />
                        <Label htmlFor="carryForwardAllowed" className="cursor-pointer">
                            Allow Carry Forward
                        </Label>
                    </div>

                    {formData.carryForwardAllowed && (
                        <div className="space-y-2 ml-6">
                            <Label htmlFor="maxCarryForward">Max Carry Forward Days *</Label>
                            <Input
                                id="maxCarryForward"
                                type="number"
                                value={formData.maxCarryForward}
                                onChange={(e) => setFormData({ ...formData, maxCarryForward: parseInt(e.target.value) })}
                                min="0"
                                required
                            />
                        </div>
                    )}

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="encashmentAllowed"
                            checked={formData.encashmentAllowed}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setFormData({ ...formData, encashmentAllowed: e.target.checked })
                            }
                        />
                        <Label htmlFor="encashmentAllowed" className="cursor-pointer">
                            Allow Encashment
                        </Label>
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
                        className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                    >
                        {loading ? 'Creating...' : 'Create Leave Type'}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}
