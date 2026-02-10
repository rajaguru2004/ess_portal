'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, User } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { LeaveRequest } from '@/types';
import { cn } from '@/lib/utils';

export default function TeamCalendarPage() {
    const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthStart = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), [currentDate]);
    const monthEnd = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0), [currentDate]);

    useEffect(() => {
        loadTeamCalendar();
    }, [currentDate]);

    const loadTeamCalendar = async () => {
        try {
            setLoading(true);
            const startStr = monthStart.toISOString().split('T')[0];
            const endStr = monthEnd.toISOString().split('T')[0];
            const response = await apiClient.getTeamCalendar(startStr, endStr);
            if (response.success) {
                setLeaves(response.data || []);
            }
        } catch (error) {
            console.error('Failed to load team calendar:', error);
        } finally {
            setLoading(false);
        }
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const calendarDays = useMemo(() => {
        const days = [];
        const startDay = monthStart.getDay(); // 0 (Sun) to 6 (Sat)

        // Add empty slots for the beginning of the month
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let i = 1; i <= monthEnd.getDate(); i++) {
            days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
        }

        return days;
    }, [currentDate, monthStart, monthEnd]);

    const getLeavesForDate = (date: Date) => {
        return leaves.filter(leave => {
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            const current = new Date(date.getFullYear(), date.getMonth(), date.getDate());

            // Set time to midnight for comparison
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            current.setHours(0, 0, 0, 0);

            return current >= start && current <= end;
        });
    };

    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <CalendarIcon className="w-8 h-8 text-indigo-600" />
                        Team Calendar
                    </h1>
                    <p className="text-slate-600 mt-1">
                        View team availability and approved leaves
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                    <Button variant="ghost" size="icon" onClick={prevMonth}>
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div className="text-lg font-bold min-w-[150px] text-center">
                        {monthName} {year}
                    </div>
                    <Button variant="ghost" size="icon" onClick={nextMonth}>
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
                    <div className="grid grid-cols-7 text-center">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="h-[600px] flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-7 border-collapse">
                            {calendarDays.map((date, idx) => {
                                if (date === null) {
                                    return <div key={`empty-${idx}`} className="h-32 border-b border-r border-slate-100 bg-slate-50/30" />;
                                }

                                const dateLeaves = getLeavesForDate(date);
                                const isToday = new Date().toDateString() === date.toDateString();

                                return (
                                    <div
                                        key={date.toISOString()}
                                        className={cn(
                                            "h-32 p-2 border-b border-r border-slate-100 hover:bg-slate-50/50 transition-colors relative overflow-y-auto",
                                            isToday && "bg-indigo-50/30"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={cn(
                                                "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                                                isToday ? "bg-indigo-600 text-white shadow-md" : "text-slate-600"
                                            )}>
                                                {date.getDate()}
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            {dateLeaves.map(leave => (
                                                <div
                                                    key={leave.id}
                                                    className="px-2 py-1 rounded text-[10px] bg-indigo-100 text-indigo-700 border border-indigo-200 truncate cursor-default group relative"
                                                    title={`${leave.user.fullName} (${leave.leaveType.name})`}
                                                >
                                                    <span className="font-semibold">{leave.user.fullName.split(' ')[0]}</span>
                                                    <div className="hidden group-hover:block absolute z-10 bg-slate-900 text-white p-2 rounded shadow-xl -top-10 left-0 whitespace-nowrap">
                                                        {leave.user.fullName} - {leave.leaveType.name}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex gap-6">
                <Card className="flex-1 bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold">Legend</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-indigo-100 border border-indigo-200"></div>
                            <span className="text-xs text-slate-600 font-medium">Approved Leave</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-sm"></div>
                            <span className="text-xs text-slate-600 font-medium">Today</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
