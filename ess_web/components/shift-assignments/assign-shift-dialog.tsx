'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import apiClient from '@/lib/api-client';
import { User, Shift } from '@/types';

const schema = z.object({
    userId: z.string().min(1, 'Employee is required'),
    shiftId: z.string().min(1, 'Shift is required'),
    date: z.string().min(1, 'Date is required'),
});

type FormData = z.infer<typeof schema>;

interface AssignShiftDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AssignShiftDialog({ open, onClose, onSuccess }: AssignShiftDialogProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        if (open) {
            fetchData();
            reset();
            setError(null);
        }
    }, [open]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersData, shiftsData] = await Promise.all([
                apiClient.getUsers(),
                apiClient.getShifts()
            ]);

            if (usersData.success) setUsers(usersData.data || []);
            if (shiftsData.success) setShifts(shiftsData.data || []);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load required data');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            setSubmitting(true);
            setError(null);

            await apiClient.createShiftAssignment(data);

            onSuccess();
        } catch (err: any) {
            console.error('Error creating assignment:', err);
            if (err.response?.status === 409) {
                setError('A shift is already assigned for this user on this date.');
            } else {
                setError(err.response?.data?.message || 'Failed to assign shift');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Assign New Shift</DialogTitle>
                    <DialogDescription>
                        Create a new shift assignment for an employee.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    {error && (
                        <div className="p-3 text-sm bg-red-50 text-red-600 rounded-md border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="userId">Employee</Label>
                        <Select
                            id="userId"
                            {...register('userId')}
                            className={errors.userId ? 'border-red-500' : ''}
                            disabled={loading}
                        >
                            <option value="">Select Employee</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.fullName} ({user.employeeCode})
                                </option>
                            ))}
                        </Select>
                        {errors.userId && (
                            <p className="text-xs text-red-500">{errors.userId.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="shiftId">Shift</Label>
                        <Select
                            id="shiftId"
                            {...register('shiftId')}
                            className={errors.shiftId ? 'border-red-500' : ''}
                            disabled={loading}
                        >
                            <option value="">Select Shift</option>
                            {shifts.map(shift => (
                                <option key={shift.id} value={shift.id}>
                                    {shift.name} ({formatTime(shift.startTime)} - {formatTime(shift.endTime)})
                                </option>
                            ))}
                        </Select>
                        {errors.shiftId && (
                            <p className="text-xs text-red-500">{errors.shiftId.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            {...register('date')}
                            className={errors.date ? 'border-red-500' : ''}
                        />
                        {errors.date && (
                            <p className="text-xs text-red-500">{errors.date.message}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting || loading}>
                            {submitting ? 'Assigning...' : 'Assign Shift'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// Helper to prevent TS errors if utils not imported or defined yet
function formatTime(isoString: string) {
    if (!isoString) return '';
    try {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return isoString;
    }
}
