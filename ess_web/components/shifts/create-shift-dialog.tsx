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

    // Helper to format initial time from default UTC string to Local HH:mm
    const getInitialTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

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

    // Local state for time inputs using HH:mm format
    const [startTimeInput, setStartTimeInput] = useState(getInitialTime(formData.startTime));
    const [endTimeInput, setEndTimeInput] = useState(getInitialTime(formData.endTime));

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTimeChange = (type: 'start' | 'end', value: string) => {
        // Parse HH:mm from input
        const [hours, minutes] = value.split(':').map(Number);

        // Create a Date object for 2023-10-27 at the specified LOCAL time
        // Note: Month is 0-indexed (9 = October)
        const date = new Date(2023, 9, 27, hours, minutes);

        // Convert to ISO string (UTC)
        const isoString = date.toISOString();

        if (type === 'start') {
            setStartTimeInput(value);
            setFormData(prev => ({
                ...prev,
                startTime: isoString
            }));
        } else {
            setEndTimeInput(value);
            setFormData(prev => ({
                ...prev,
                endTime: isoString
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await apiClient.createShift(formData);
            if (response.success) {
                // Reset form
                const defaultStart = '2023-10-27T09:00:00.000Z';
                const defaultEnd = '2023-10-27T18:00:00.000Z';
                setFormData({
                    tenantId: user?.tenantId || '',
                    name: '',
                    code: '',
                    startTime: defaultStart,
                    endTime: defaultEnd,
                    graceMinutes: 15,
                    breakMinutes: 60,
                    isRotational: false,
                });
                setStartTimeInput(getInitialTime(defaultStart));
                setEndTimeInput(getInitialTime(defaultEnd));

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
                            <Label htmlFor="startTime">Start Time *</Label>
                            <Input
                                id="startTime"
                                type="time"
                                value={startTimeInput}
                                onChange={(e) => handleTimeChange('start', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endTime">End Time *</Label>
                            <Input
                                id="endTime"
                                type="time"
                                value={endTimeInput}
                                onChange={(e) => handleTimeChange('end', e.target.value)}
                                required
                            />
                        </div>
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
