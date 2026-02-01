'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Building2, Calendar } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { getUser } from '@/lib/auth';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState({
        roles: 0,
        departments: 0,
        shifts: 0,
        leaveTypes: 0,
        holidays: 0,
        designations: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = getUser();
        setUser(currentUser);
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [roles, departments, shifts, leaveTypes, holidays, designations] = await Promise.all([
                apiClient.getRoles(),
                apiClient.getDepartments(),
                apiClient.getShifts(),
                apiClient.getLeaveTypes(),
                apiClient.getHolidays(),
                apiClient.getDesignations(),
            ]);

            setStats({
                roles: roles.data?.length || 0,
                departments: departments.data?.length || 0,
                shifts: shifts.data?.length || 0,
                leaveTypes: leaveTypes.data?.length || 0,
                holidays: holidays.data?.length || 0,
                designations: designations.data?.length || 0,
            });
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    Welcome back, {user?.fullName || 'Admin'}!
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Here's an overview of your ESS Portal
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-purple-600 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-slate-600">Roles</CardTitle>
                            <Shield className="w-5 h-5 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? '...' : stats.roles}</div>
                        <p className="text-xs text-slate-500 mt-1">Total roles defined</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-600 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-slate-600">Departments</CardTitle>
                            <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? '...' : stats.departments}</div>
                        <p className="text-xs text-slate-500 mt-1">Active departments</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-600 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-slate-600">Shifts</CardTitle>
                            <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? '...' : stats.shifts}</div>
                        <p className="text-xs text-slate-500 mt-1">Configured shifts</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-600 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-slate-600">Leave Types</CardTitle>
                            <Calendar className="w-5 h-5 text-orange-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? '...' : stats.leaveTypes}</div>
                        <p className="text-xs text-slate-500 mt-1">Leave categories</p>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common administrative tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <a href="/dashboard/users" className="block p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-slate-200 dark:border-slate-700 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-sm">Create New User</p>
                                    <p className="text-xs text-slate-500">Add a new employee to the system</p>
                                </div>
                                <Users className="w-5 h-5 text-purple-600" />
                            </div>
                        </a>
                        <a href="/dashboard/holidays" className="block p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-slate-200 dark:border-slate-700 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-sm">Add Holiday</p>
                                    <p className="text-xs text-slate-500">Define organization holidays</p>
                                </div>
                                <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                        </a>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>System Overview</CardTitle>
                        <CardDescription>Additional statistics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <span className="text-sm font-medium">Holidays</span>
                            <span className="text-lg font-bold text-purple-600">{loading ? '...' : stats.holidays}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <span className="text-sm font-medium">Designations</span>
                            <span className="text-lg font-bold text-blue-600">{loading ? '...' : stats.designations}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
