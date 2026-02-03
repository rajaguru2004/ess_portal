'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Users } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { User, Role, Department } from '@/types';
import { formatDate } from '@/lib/utils';
import CreateUserDialog from '@/components/users/create-user-dialog';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);

    useEffect(() => {
        loadUsers();
        loadMetaData();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await apiClient.getUsers();
            if (response.success) {
                setUsers(response.data || []);
            }
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMetaData = async () => {
        try {
            const [rolesRes, deptsRes] = await Promise.all([
                apiClient.getRoles(),
                apiClient.getDepartments()
            ]);
            if (rolesRes.success) setRoles(rolesRes.data);
            if (deptsRes.success) setDepartments(deptsRes.data);
        } catch (error) {
            console.error('Failed to load metadata', error);
        }
    }

    const getRoleName = (roleId?: string) => {
        return roles.find(r => r.id === roleId)?.name || roleId || '-';
    }

    const getDeptName = (deptId?: string) => {
        return departments.find(d => d.id === deptId)?.name || deptId || '-';
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Users className="w-8 h-8 text-blue-600" />
                        User Management
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Manage system users and employees
                    </p>
                </div>
                <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create User
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>List of all registered users</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-slate-500">Loading users...</div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            No users found. Create your first user to get started.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Full Name</TableHead>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead>Created</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            <span className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">
                                                {user.employeeCode || '-'}
                                            </span>
                                        </TableCell>
                                        <TableCell>{user.fullName}</TableCell>
                                        <TableCell className="text-slate-500">{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">
                                                {user.Role?.name || getRoleName(user.roleId)}
                                            </span>
                                        </TableCell>
                                        <TableCell>{getDeptName(user.departmentId)}</TableCell>
                                        <TableCell className="text-center">
                                            {user.isActive ? (
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
                                            {formatDate(user.createdAt)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <CreateUserDialog
                open={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
                onSuccess={() => {
                    setShowCreateDialog(false);
                    loadUsers();
                }}
                roles={roles}
                departments={departments}
            />
        </div>
    );
}
