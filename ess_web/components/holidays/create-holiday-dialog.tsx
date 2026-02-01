'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import apiClient from '@/lib/api-client';
import { CreateHolidayRequest } from '@/types';
import { getUser } from '@/lib/auth';

interface CreateHolidayDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateHolidayDialog({ open, onClose, onSuccess }: CreateHolidayDialogProps) {
    const user = getUser();
    const [formData, setFormData] = useState<CreateHolidayRequest>({
        tenantId: user?.tenantId || '',
        branchId: null,
        name: '',
        date: new Date().toISOString().split('T')[0],
        type: 'ORGANIZATION',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await apiClient.createHoliday({
                ...formData,
                date: new Date(formData.date).toISOString(),
            });
            if (response.success) {
                setFormData({
                    tenantId: user?.tenantId || '',
                    branchId: null,
                    name: '',
                    date: new Date().toISOString().split('T')[0],
                    type: 'ORGANIZATION',
                });
                onSuccess();
            } else {
                setError(response.message || 'Failed to create holiday');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create holiday');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>Add New Holiday</DialogTitle>
                    <DialogDescription>Add a holiday to the calendar</DialogDescription>
                </DialogHeader>

                <DialogContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Holiday Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., New Year"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Date *</Label>
                        <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Type *</Label>
                        <Input
                            id="type"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            placeholder="e.g., ORGANIZATION"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="branchId">Branch ID (Optional)</Label>
                        <Input
                            id="branchId"
                            value={formData.branchId || ''}
                            onChange={(e) => setFormData({ ...formData, branchId: e.target.value || null })}
                            placeholder="Leave empty for all branches"
                        />
                        <p className="text-xs text-slate-500">Leave blank to apply to all branches</p>
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
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                        {loading ? 'Adding...' : 'Add Holiday'}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}
