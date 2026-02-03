'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Calendar } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { LeaveType } from '@/types';
import { formatDate } from '@/lib/utils';
import CreateLeaveTypeDialog from '@/components/leave-types/create-leave-type-dialog';

export default function LeaveTypesPage() {
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    useEffect(() => {
        loadLeaveTypes();
    }, []);

    const loadLeaveTypes = async () => {
        try {
            setLoading(true);
            const response = await apiClient.getLeaveTypes();
            if (response.success) {
                setLeaveTypes(response.data || []);
            }
        } catch (error) {
            console.error('Failed to load leave types:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-orange-600" />
                        Leave Types
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Manage leave categories and policies
                    </p>
                </div>
                <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-lg"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Leave Type
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Leave Types</CardTitle>
                    <CardDescription>Configured leave categories</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-slate-500">Loading leave types...</div>
                    ) : leaveTypes.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            No leave types found. Create your first leave type to get started.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead className="text-right">Default Days</TableHead>
                                    <TableHead className="text-center">Carry Forward</TableHead>
                                    <TableHead className="text-center">Encashment</TableHead>
                                    <TableHead>Created</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leaveTypes.map((type) => (
                                    <TableRow key={type.id}>
                                        <TableCell className="font-medium">{type.name}</TableCell>
                                        <TableCell>
                                            <code className="px-2 py-1 bg-slate-100 rounded text-xs">
                                                {type.code}
                                            </code>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">{type.defaultDays}</TableCell>
                                        <TableCell className="text-center">
                                            {type.carryForwardAllowed ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Yes (Max: {type.maxCarryForward})
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                    No
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {type.encashmentAllowed ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Allowed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                    Not Allowed
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-sm">
                                            {formatDate(type.createdAt)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <CreateLeaveTypeDialog
                open={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
                onSuccess={() => {
                    setShowCreateDialog(false);
                    loadLeaveTypes();
                }}
            />
        </div>
    );
}
