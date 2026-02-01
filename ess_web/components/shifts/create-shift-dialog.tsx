'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import apiClient from '@/lib/api-client';
import { CreateShiftRequest } from '@/types';
import { getUser } from '@/lib/auth';

interface CreateShiftDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateShiftDialog({ open, onClose, onSuccess }: CreateShiftDialogProps) {
    const user = getUser();
    const [formData, setFormData] = useState<CreateShiftRequest>({
        tenantId: user?.tenantId || '',
        name: '',
        code: '',
        startTime: '2023-10-27T09:00:00.000Z',
        endTime: '2023-10-27T18:00:00.000Z',
        graceMinutes: 15,
        breakMinutes: 60,
        isRotational: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await apiClient.createShift(formData);
            if (response.success) {
                setFormData({
                    tenantId: user?.tenantId || '',
                    name: '',
                    code: '',
                    startTime: '2023-10-27T09:00:00.000Z',
                    endTime: '2023-10-27T18:00:00.000Z',
                    graceMinutes: 15,
                    breakMinutes: 60,
                    isRotational: false,
                });
                onSuccess();
            } else {
                setError(response.message || 'Failed to create shift');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create shift');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>Create New Shift</DialogTitle>
                    <DialogDescription>Add a new work shift to the system</DialogDescription>
                </DialogHeader>

                <DialogContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Shift Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., General Shift"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="code">Shift Code *</Label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            placeholder="e.g., GEN_SHIFT"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="graceMinutes">Grace Minutes *</Label>
                            <Input
                                id="graceMinutes"
                                type="number"
                                value={formData.graceMinutes}
                                onChange={(e) => setFormData({ ...formData, graceMinutes: parseInt(e.target.value) })}
                                min="0"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="breakMinutes">Break Minutes *</Label>
                            <Input
                                id="breakMinutes"
                                type="number"
                                value={formData.breakMinutes}
                                onChange={(e) => setFormData({ ...formData, breakMinutes: parseInt(e.target.value) })}
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isRotational"
                            checked={formData.isRotational}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setFormData({ ...formData, isRotational: e.target.checked })
                            }
                        />
                        <Label htmlFor="isRotational" className="cursor-pointer">
                            Rotational Shift
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
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                        {loading ? 'Creating...' : 'Create Shift'}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}
