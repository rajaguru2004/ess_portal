'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Building2 } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { Department } from '@/types';
import { formatDate } from '@/lib/utils';
import CreateDepartmentDialog from '@/components/departments/create-department-dialog';

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            setLoading(true);
            const response = await apiClient.getDepartments();
            if (response.success) {
                setDepartments(response.data || []);
            }
        } catch (error) {
            console.error('Failed to load departments:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-blue-600" />
                        Departments
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Manage organizational departments
                    </p>
                </div>
                <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Department
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Departments</CardTitle>
                    <CardDescription>A list of all departments across branches</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-slate-500">Loading departments...</div>
                    ) : departments.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            No departments found. Create your first department to get started.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Branch ID</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead>Created</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {departments.map((dept) => (
                                    <TableRow key={dept.id}>
                                        <TableCell className="font-medium">{dept.name}</TableCell>
                                        <TableCell>
                                            <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                                                {dept.code}
                                            </code>
                                        </TableCell>
                                        <TableCell className="text-slate-600">{dept.branchId}</TableCell>
                                        <TableCell className="text-center">
                                            {dept.isActive ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                                                    Inactive
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-sm">
                                            {formatDate(dept.createdAt)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <CreateDepartmentDialog
                open={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
                onSuccess={() => {
                    setShowCreateDialog(false);
                    loadDepartments();
                }}
            />
        </div>
    );
}
