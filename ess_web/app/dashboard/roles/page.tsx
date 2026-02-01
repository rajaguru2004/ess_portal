'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Shield } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { Role } from '@/types';
import { formatDate } from '@/lib/utils';
import CreateRoleDialog from '@/components/roles/create-role-dialog';

export default function RolesPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        try {
            setLoading(true);
            const response = await apiClient.getRoles();
            if (response.success) {
                setRoles(response.data || []);
            }
        } catch (error) {
            console.error('Failed to load roles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleCreated = () => {
        setShowCreateDialog(false);
        loadRoles();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Shield className="w-8 h-8 text-purple-600" />
                        Roles
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Manage user roles and permissions
                    </p>
                </div>
                <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Role
                </Button>
            </div>

            {/* Roles Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Roles</CardTitle>
                    <CardDescription>
                        A list of all roles in the system
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-slate-500">Loading roles...</div>
                    ) : roles.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            No roles found. Create your first role to get started.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-center">System Role</TableHead>
                                    <TableHead>Created</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roles.map((role) => (
                                    <TableRow key={role.id}>
                                        <TableCell className="font-medium">{role.name}</TableCell>
                                        <TableCell>
                                            <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                                                {role.code}
                                            </code>
                                        </TableCell>
                                        <TableCell className="text-slate-600 dark:text-slate-400">
                                            {role.description}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {role.isSystemRole ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                                                    System
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300">
                                                    Custom
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-sm">
                                            {formatDate(role.createdAt)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Create Dialog */}
            <CreateRoleDialog
                open={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
                onSuccess={handleRoleCreated}
            />
        </div>
    );
}
