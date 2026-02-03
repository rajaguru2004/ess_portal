'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { Attendance } from '@/types';
import { formatDate, formatTime, formatDuration } from '@/lib/utils';

export default function AttendancePage() {
    const [attendanceLogs, setAttendanceLogs] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        loadAttendance();
    }, []);

    const loadAttendance = async () => {
        try {
            setLoading(true);
            const response = await apiClient.getAttendanceLogs(startDate, endDate);
            if (response.success) {
                setAttendanceLogs(response.data || []);
            }
        } catch (error) {
            console.error('Failed to load attendance:', error);
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
                        Attendance Reports
                    </h1>
                    <p className="text-slate-600 mt-1">
                        View employee attendance logs and check-in/check-out history
                    </p>
                </div>
            </div>

            {/* Date Filter */}
            <Card>
                <CardHeader>
                    <CardTitle>Filter Attendance</CardTitle>
                    <CardDescription>Select date range to view attendance records</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <div className="flex items-end">
                            <Button
                                onClick={loadAttendance}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover-from-green-700 hover:to-emerald-700"
                            >
                                Apply Filter
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Attendance Logs */}
            <div className="space-y-4">
                {loading ? (
                    <Card>
                        <CardContent className="py-12 text-center text-slate-500">
                            Loading attendance logs...
                        </CardContent>
                    </Card>
                ) : attendanceLogs.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-slate-500">
                            No attendance records found for the selected date range.
                        </CardContent>
                    </Card>
                ) : (
                    attendanceLogs.map((attendance) => (
                        <Card key={attendance.id} className="overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{formatDate(attendance.date)}</CardTitle>
                                        <CardDescription className="mt-1">
                                            User ID: {attendance.userId}
                                        </CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${attendance.status === 'CHECKED_OUT'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-blue-100 text-blue-800'
                                                }`}
                                        >
                                            {attendance.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="space-y-1">
                                        <p className="text-sm text-slate-500">Check In</p>
                                        <p className="font-medium">{formatTime(attendance.checkInAt)}</p>
                                        {attendance.isLate && (
                                            <span className="text-xs text-red-600">Late</span>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-slate-500">Check Out</p>
                                        <p className="font-medium">
                                            {attendance.checkOutAt ? formatTime(attendance.checkOutAt) : 'Not checked out'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-slate-500">Work Duration</p>
                                        <p className="font-medium text-green-600">{formatDuration(attendance.workMinutes)}</p>
                                    </div>
                                </div>

                                {/* Attendance Logs */}
                                {attendance.logs && attendance.logs.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-sm text-slate-700">Activity Log</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {attendance.logs.map((log) => (
                                                <div
                                                    key={log.id}
                                                    className="border border-slate-200 rounded-lg p-4 space-y-3"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-medium">
                                                                {log.type === 'IN' ? 'Check In' : 'Check Out'}
                                                            </p>
                                                            <p className="text-sm text-slate-500">{formatTime(log.timestamp)}</p>
                                                        </div>
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs font-medium ${log.type === 'IN'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                                }`}
                                                        >
                                                            {log.type}
                                                        </span>
                                                    </div>

                                                    {log.photoUrl && (
                                                        <div>
                                                            <img
                                                                src={log.photoUrl}
                                                                alt={`${log.type} photo`}
                                                                className="w-full h-32 object-cover rounded"
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="text-xs text-slate-500 space-y-1">
                                                        {log.latitude && log.longitude && (
                                                            <p>Location: {log.latitude}, {log.longitude}</p>
                                                        )}
                                                        {log.deviceInfo && <p>Device: {log.deviceInfo}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
