'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import apiClient from '@/lib/api-client';

const schema = z.object({
    reason: z.string().min(3, 'Reason must be at least 3 characters'),
});

type FormData = z.infer<typeof schema>;

interface RejectDialogProps {
    open: boolean;
    assignmentId: string | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function RejectDialog({ open, assignmentId, onClose, onSuccess }: RejectDialogProps) {
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        if (!assignmentId) return;

        try {
            setSubmitting(true);
            await apiClient.rejectShiftAssignment(assignmentId, data.reason);
            reset();
            onSuccess();
        } catch (error) {
            console.error('Failed to reject assignment:', error);
            // Could add toast here
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reject Shift Assignment</DialogTitle>
                    <DialogDescription>
                        Please provide a reason for rejecting this request.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="reason">Rejection Reason</Label>
                        <Input
                            id="reason"
                            placeholder="e.g. User already assigned to another shift"
                            {...register('reason')}
                            className={errors.reason ? 'border-red-500' : ''}
                        />
                        {errors.reason && (
                            <p className="text-xs text-red-500">{errors.reason.message}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="destructive" disabled={submitting}>
                            {submitting ? 'Rejecting...' : 'Confirm Rejection'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
