'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Award } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { Designation } from '@/types';
import { formatDate } from '@/lib/utils';
import CreateDesignationDialog from '@/components/designations/create-designation-dialog';

export default function DesignationsPage() {
    const [designations, setDesignations] = useState<Designation[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    useEffect(() => {
        loadDesignations();
    }, []);

    const loadDesignations = async () => {
        try {
            setLoading(true);
            const response = await apiClient.getDesignations();
            if (response.success) {
                setDesignations(response.data || []);
            }
        } catch (error) {
            console.error('Failed to load designations:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Award className="w-8 h-8 text-indigo-600" />
                        Designations
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Manage employee designations and titles
                    </p>
                </div>
                <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Designation
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Designations</CardTitle>
                    <CardDescription>Employee job titles and positions</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-slate-500">Loading designations...</div>
                    ) : designations.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            No designations found. Create your first designation to get started.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead>Created</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {designations.map((designation) => (
                                    <TableRow key={designation.id}>
                                        <TableCell className="font-medium">{designation.name}</TableCell>
                                        <TableCell>
                                            <code className="px-2 py-1 bg-slate-100 rounded text-xs">
                                                {designation.code}
                                            </code>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {designation.isActive ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Inactive
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-sm">
                                            {formatDate(designation.createdAt)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <CreateDesignationDialog
                open={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
                onSuccess={() => {
                    setShowCreateDialog(false);
                    loadDesignations();
                }}
            />
        </div>
    );
}
