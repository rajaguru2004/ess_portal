'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import apiClient from '@/lib/api-client';

interface RejectLeaveDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    leaveId: string | null;
}

export default function RejectLeaveDialog({ open, onClose, onSuccess, leaveId }: RejectLeaveDialogProps) {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReject = async () => {
        if (!leaveId || !reason.trim()) return;

        try {
            setLoading(true);
            const response = await apiClient.rejectLeave(leaveId, reason);
            if (response.success) {
                onSuccess();
                setReason('');
            }
        } catch (error) {
            console.error('Failed to reject leave:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogHeader>
                <DialogTitle>Reject Leave Request</DialogTitle>
                <DialogDescription>
                    Please provide a reason for rejecting this leave request.
                </DialogDescription>
            </DialogHeader>
            <DialogContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="reason">Rejection Reason</Label>
                    <Input
                        id="reason"
                        placeholder="Enter reason..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        autoFocus
                    />
                </div>
            </DialogContent>
            <DialogFooter>
                <Button variant="outline" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={loading || !reason.trim()}
                >
                    {loading ? 'Rejecting...' : 'Reject Leave'}
                </Button>
            </DialogFooter>
        </Dialog>
    );
}
