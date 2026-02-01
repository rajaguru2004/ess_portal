'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Clock } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { Shift } from '@/types';
import { formatDate, formatTime } from '@/lib/utils';
import CreateShiftDialog from '@/components/shifts/create-shift-dialog';

export default function ShiftsPage() {
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    useEffect(() => {
        loadShifts();
    }, []);

    const loadShifts = async () => {
        try {
            setLoading(true);
            const response = await apiClient.getShifts();
            if (response.success) {
                setShifts(response.data || []);
            }
        } catch (error) {
            console.error('Failed to load shifts:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Clock className="w-8 h-8 text-green-600" />
                        Shifts
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Manage work shifts and schedules
                    </p>
                </div>
                <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Shift
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Shifts</CardTitle>
                    <CardDescription>Configured work shifts and timings</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-slate-500">Loading shifts...</div>
                    ) : shifts.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            No shifts found. Create your first shift to get started.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Start Time</TableHead>
                                    <TableHead>End Time</TableHead>
                                    <TableHead>Grace</TableHead>
                                    <TableHead>Break</TableHead>
                                    <TableHead className="text-center">Rotational</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {shifts.map((shift) => (
                                    <TableRow key={shift.id}>
                                        <TableCell className="font-medium">{shift.name}</TableCell>
                                        <TableCell>
                                            <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                                                {shift.code}
                                            </code>
                                        </TableCell>
                                        <TableCell className="text-sm">{formatTime(shift.startTime)}</TableCell>
                                        <TableCell className="text-sm">{formatTime(shift.endTime)}</TableCell>
                                        <TableCell className="text-sm">{shift.graceMinutes} min</TableCell>
                                        <TableCell className="text-sm">{shift.breakMinutes} min</TableCell>
                                        <TableCell className="text-center">
                                            {shift.isRotational ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300">
                                                    No
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <CreateShiftDialog
                open={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
                onSuccess={() => {
                    setShowCreateDialog(false);
                    loadShifts();
                }}
            />
        </div>
    );
}
