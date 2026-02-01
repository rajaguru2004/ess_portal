'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Calendar } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { Holiday } from '@/types';
import { formatDate } from '@/lib/utils';
import CreateHolidayDialog from '@/components/holidays/create-holiday-dialog';

export default function HolidaysPage() {
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    useEffect(() => {
        loadHolidays();
    }, []);

    const loadHolidays = async () => {
        try {
            setLoading(true);
            const response = await apiClient.getHolidays();
            if (response.success) {
                setHolidays(response.data || []);
            }
        } catch (error) {
            console.error('Failed to load holidays:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-purple-600" />
                        Holidays
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Manage organization and branch holidays
                    </p>
                </div>
                <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Holiday
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Holidays</CardTitle>
                    <CardDescription>Organization and branch-specific holidays</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-slate-500">Loading holidays...</div>
                    ) : holidays.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            No holidays found. Add your first holiday to get started.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Branch</TableHead>
                                    <TableHead>Added</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {holidays.map((holiday) => (
                                    <TableRow key={holiday.id}>
                                        <TableCell className="font-medium">{holiday.name}</TableCell>
                                        <TableCell className="text-sm">{formatDate(holiday.date)}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                                                {holiday.type}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-slate-600">
                                            {holiday.branchId || 'All Branches'}
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-sm">
                                            {formatDate(holiday.createdAt)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <CreateHolidayDialog
                open={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
                onSuccess={() => {
                    setShowCreateDialog(false);
                    loadHolidays();
                }}
            />
        </div>
    );
}
