'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, ShieldCheck } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { RoleLeavePolicy, Role, LeaveType } from '@/types';
import { formatDate } from '@/lib/utils';
import CreateRoleLeavePolicyDialog from '@/components/leave-policies/create-policy-dialog';

export default function LeavePoliciesPage() {
    const [policies, setPolicies] = useState<RoleLeavePolicy[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [policiesRes, rolesRes, leaveTypesRes] = await Promise.all([
                apiClient.getRoleLeavePolicies(),
                apiClient.getRoles(),
                apiClient.getLeaveTypes()
            ]);

            if (policiesRes.success) setPolicies(policiesRes.data || []);
            if (rolesRes.success) setRoles(rolesRes.data || []);
            if (leaveTypesRes.success) setLeaveTypes(leaveTypesRes.data || []);

        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRoleName = (id: string) => roles.find(r => r.id === id)?.name || id;
    const getLeaveTypeName = (id: string) => leaveTypes.find(lt => lt.id === id)?.name || id;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-indigo-600" />
                        Role Leave Policies
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Configure leave quotas for each role
                    </p>
                </div>
                <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Policy
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Policy Configuration</CardTitle>
                    <CardDescription>Defined leave quotas and accrual rules</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-slate-500">Loading policies...</div>
                    ) : policies.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            No policies defined. Create your first policy mapping.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Leave Type</TableHead>
                                    <TableHead className="text-right">Annual Quota</TableHead>
                                    <TableHead>Accrual Type</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead>Created</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {policies.map((policy) => (
                                    <TableRow key={policy.id}>
                                        <TableCell className="font-medium">
                                            {getRoleName(policy.roleId)}
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-50 text-orange-700">
                                                {getLeaveTypeName(policy.leaveTypeId)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-slate-700">
                                            {policy.annualQuota} Days
                                        </TableCell>
                                        <TableCell>
                                            <code className="px-2 py-1 bg-slate-100 rounded text-xs uppercase">
                                                {policy.accrualType}
                                            </code>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {policy.isActive ? (
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
                                            {formatDate(policy.createdAt)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <CreateRoleLeavePolicyDialog
                open={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
                onSuccess={() => {
                    setShowCreateDialog(false);
                    loadData();
                }}
                roles={roles}
                leaveTypes={leaveTypes}
            />
        </div>
    );
}
