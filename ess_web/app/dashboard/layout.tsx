'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Users,
    Shield,
    Building2,
    Clock,
    Calendar,
    FileText,
    Award,
    Briefcase,
    LogOut,
    ChevronRight,
    Menu
} from 'lucide-react';
import { getUser, clearAuth } from '@/lib/auth';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    {
        name: 'Master Data',
        icon: Briefcase,
        children: [
            { name: 'Roles', href: '/dashboard/roles', icon: Shield },
            { name: 'Departments', href: '/dashboard/departments', icon: Building2 },
            { name: 'Shifts', href: '/dashboard/shifts', icon: Clock },
            { name: 'Leave Types', href: '/dashboard/leave-types', icon: Calendar },
            { name: 'Holidays', href: '/dashboard/holidays', icon: Calendar },
            { name: 'Designations', href: '/dashboard/designations', icon: Award },
        ],
    },
    { name: 'Leave Policies', href: '/dashboard/leave-policies', icon: FileText },
    { name: 'User Management', href: '/dashboard/users', icon: Users },
    { name: 'Attendance Reports', href: '/dashboard/attendance', icon: Clock },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [expandedSections, setExpandedSections] = useState<string[]>(['Master Data']);

    useEffect(() => {
        const currentUser = getUser();
        if (!currentUser) {
            router.push('/login');
            return;
        }
        setUser(currentUser);
    }, [router]);

    const handleLogout = () => {
        clearAuth();
        router.push('/login');
    };

    const toggleSection = (name: string) => {
        setExpandedSections(prev =>
            prev.includes(name)
                ? prev.filter(s => s !== name)
                : [...prev, name]
        );
    };

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-40 h-screen transition-all duration-300 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-xl",
                    sidebarOpen ? "w-64" : "w-20"
                )}
            >
                {/* Logo */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className={cn("flex items-center space-x-3", !sidebarOpen && "justify-center w-full")}>
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            E
                        </div>
                        {sidebarOpen && (
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    ESS Portal
                                </h1>
                                <p className="text-xs text-slate-500">Admin Panel</p>
                            </div>
                        )}
                    </div>
                    {sidebarOpen && (
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <Menu className="w-5 h-5 text-slate-600" />
                        </button>
                    )}
                </div>

                {/* User Info */}
                {sidebarOpen && (
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                                {user.fullName?.charAt(0) || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                    {user.fullName}
                                </p>
                                <p className="text-xs text-slate-500 truncate">{user.username}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {navigation.map((item) => {
                        if (item.children) {
                            const isExpanded = expandedSections.includes(item.name);
                            return (
                                <div key={item.name}>
                                    <button
                                        onClick={() => toggleSection(item.name)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                            sidebarOpen ? "justify-between" : "justify-center",
                                            "text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600"
                                        )}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <item.icon className="w-5 h-5" />
                                            {sidebarOpen && <span>{item.name}</span>}
                                        </div>
                                        {sidebarOpen && (
                                            <ChevronRight
                                                className={cn(
                                                    "w-4 h-4 transition-transform",
                                                    isExpanded && "rotate-90"
                                                )}
                                            />
                                        )}
                                    </button>
                                    {sidebarOpen && isExpanded && (
                                        <div className="ml-8 mt-1 space-y-1">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className={cn(
                                                        "flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors",
                                                        pathname === child.href
                                                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                                                            : "text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600"
                                                    )}
                                                >
                                                    <child.icon className="w-4 h-4" />
                                                    <span>{child.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                    sidebarOpen ? "space-x-3" : "justify-center",
                                    pathname === item.href
                                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                                        : "text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {sidebarOpen && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <button
                        onClick={handleLogout}
                        className={cn(
                            "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                            sidebarOpen ? "space-x-3" : "justify-center",
                            "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        )}
                    >
                        <LogOut className="w-5 h-5" />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>

                {/* Collapse button for closed sidebar */}
                {!sidebarOpen && (
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main
                className={cn(
                    "transition-all duration-300",
                    sidebarOpen ? "ml-64" : "ml-20"
                )}
            >
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
