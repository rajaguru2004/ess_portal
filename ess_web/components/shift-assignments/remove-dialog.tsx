'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/api-client';

interface RemoveDialogProps {
    open: boolean;
    assignmentId: string | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function RemoveDialog({ open, assignmentId, onClose, onSuccess }: RemoveDialogProps) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        if (!assignmentId) return;

        try {
            setSubmitting(true);
            setError(null);
            await apiClient.removeShiftAssignment(assignmentId);
            onSuccess();
        } catch (err: any) {
            console.error('Failed to remove assignment:', err);
            setError(err.response?.data?.message || 'Failed to remove assignment');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Remove Assignment</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to remove this shift assignment? This action cannot be undone.
                        <br /><span className="text-red-500 text-xs mt-1 block">Note: Only future assignments can be removed.</span>
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleConfirm} disabled={submitting}>
                        {submitting ? 'Removing...' : 'Remove Assignment'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
